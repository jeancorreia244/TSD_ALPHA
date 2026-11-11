const { buildSchema } = require('graphql');
const { signToken, getUserFromToken, hashPassword, comparePassword } = require('./auth');
const { supabase } = require('./db');
const { validate, schemas } = require('./validation');
const { sanitizeObject } = require('./middleware/sanitizer');
const { v4: uuidv4 } = require('crypto');

// Helper para gerar invite code
const generateInviteCode = () => {
  return `G-${require('crypto').randomBytes(3).toString('hex').toUpperCase()}`;
};

const schema = buildSchema(`
  enum EventStatus {
    pendente
    confirmed
    cancelled
  }

  type User {
    id: Int
    name: String
    email: String
    phone: String
    created_at: String
  }

  type Bible {
    id: Int
    user_id: Int
    book: String
    chapter: Int
    verse: String
    notes: String
    created_at: String
  }

  type Prayer {
    id: Int
    user_id: Int
    focus: String
    note: String
    duration: Int
    created_at: String
  }

  type Fasting {
    id: Int
    user_id: Int
    start_date: String
    end_date: String
    duration_hours: Int
    notes: String
    created_at: String
  }

  type Devotional {
    id: Int
    user_id: Int
    reference: String
    title: String
    content: String
    date: String
    created_at: String
  }

  type GroupMember {
    id: Int
    role: String
    user: User
  }

  type Group {
    id: Int
    created_by: Int
    name: String
    description: String
    focus: String
    invite_code: String
    progress: Int
    created_at: String
    group_members: [GroupMember]
  }

  type AuthPayload {
    token: String
    user: User
  }

  input BibleInput {
    book: String!
    chapter: Int!
    verse: String
    notes: String
  }

  input PrayerInput {
    focus: String
    note: String
    duration: Int!
  }

  input FastingInput {
    start_date: String!
    end_date: String!
    duration_hours: Int
    notes: String
  }

  input DevotionalInput {
    reference: String
    title: String
    content: String!
    date: String!
  }

  input GroupInput {
    name: String!
    description: String
    focus: String
    invite_code: String
  }

  type Query {
    me: User
    bibles: [Bible]
    prayers: [Prayer]
    fastings: [Fasting]
    devotionals: [Devotional]
    groups: [Group]
  }

  type Mutation {
    register(name: String!, email: String!, password: String!, phone: String): AuthPayload
    login(email: String!, password: String!): AuthPayload
    createBible(bible: BibleInput!): Bible
    createPrayer(prayer: PrayerInput!): Prayer
    createFasting(fasting: FastingInput!): Fasting
    createDevotional(devotional: DevotionalInput!): Devotional
    createGroup(group: GroupInput!): Group
    joinGroup(inviteCode: String!): Group
  }
`);

const root = {
  // QUERIES
  me: async (args, context) => {
    const user = await getUserFromToken(context.token);
    if (!user) throw new Error('Não autenticado');
    return user;
  },

  bibles: async (args, context) => {
    const user = await getUserFromToken(context.token);
    if (!user) throw new Error('Não autenticado');

    const { data, error } = await supabase
      .from('bibles')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  prayers: async (args, context) => {
    const user = await getUserFromToken(context.token);
    if (!user) throw new Error('Não autenticado');

    const { data, error } = await supabase
      .from('prayers')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  fastings: async (args, context) => {
    const user = await getUserFromToken(context.token);
    if (!user) throw new Error('Não autenticado');

    const { data, error } = await supabase
      .from('fastings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  devotionals: async (args, context) => {
    const user = await getUserFromToken(context.token);
    if (!user) throw new Error('Não autenticado');

    const { data, error } = await supabase
      .from('devotionals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  groups: async (args, context) => {
    const user = await getUserFromToken(context.token);
    if (!user) throw new Error('Não autenticado');

    // Buscar grupos onde o usuário é criador OU membro
    const { data: createdGroups, error: createdError } = await supabase
      .from('groups')
      .select(`
        *,
        group_members (
          id,
          role,
          user:Users (id, name, email)
        )
      `)
      .eq('created_by', user.id)
      .order('created_at', { ascending: false });

    const { data: memberGroups, error: memberError } = await supabase
      .from('groups')
      .select(`
        *,
        group_members!inner (
          id,
          role,
          user:Users (id, name, email)
        )
      `)
      .eq('group_members.user_id', user.id)
      .order('created_at', { ascending: false });

    if (createdError) console.error('Error fetching created groups:', createdError);
    if (memberError) console.error('Error fetching member groups:', memberError);

    // Combinar e remover duplicados (pode ser criador e membro)
    const allGroups = [...(createdGroups || []), ...(memberGroups || [])];
    const uniqueGroups = allGroups.filter((group, index, self) =>
      index === self.findIndex(g => g.id === group.id)
    );

    return uniqueGroups;
  },

  // MUTATIONS
  register: async ({ name, email, password, phone }, context) => {
    validate(schemas.register, { name, email, password, phone });
    const clean = sanitizeObject({ name, email, phone });

    const { data: existing } = await supabase
      .from('Users')
      .select('id')
      .eq('email', clean.email)
      .single();

    if (existing) throw new Error('Email já cadastrado');

    const hashed = await hashPassword(password);
    const { data, error } = await supabase
      .from('Users')
      .insert([{ ...clean, password_hash: hashed }])
      .select('id, name, email, phone, created_at')
      .single();

    if (error) throw error;
    const token = signToken(data);
    return { token, user: data };
  },

  login: async ({ email, password }, context) => {
    validate(schemas.login, { email, password });

    const { data: user, error } = await supabase
      .from('Users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !user) throw new Error('Email ou senha inválidos');

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) throw new Error('Email ou senha inválidos');

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      created_at: user.created_at
    };

    const token = signToken(userData);
    return { token, user: userData };
  },

  createBible: async ({ bible }, context) => {
    const user = await getUserFromToken(context.token);
    if (!user) throw new Error('Não autenticado');

    validate(schemas.bible, bible);
    const clean = sanitizeObject(bible);

    const { data, error } = await supabase
      .from('bibles')
      .insert([{ ...clean, user_id: user.id }])
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },

  createPrayer: async ({ prayer }, context) => {
    const user = await getUserFromToken(context.token);
    if (!user) throw new Error('Não autenticado');

    validate(schemas.prayer, prayer);
    const clean = sanitizeObject(prayer);

    const { data, error } = await supabase
      .from('prayers')
      .insert([{ ...clean, user_id: user.id }])
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },

  createFasting: async ({ fasting }, context) => {
    const user = await getUserFromToken(context.token);
    if (!user) throw new Error('Não autenticado');

    validate(schemas.fasting, fasting);
    const clean = sanitizeObject(fasting);

    const { data, error } = await supabase
      .from('fastings')
      .insert([{ ...clean, user_id: user.id }])
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },

  createDevotional: async ({ devotional }, context) => {
    const user = await getUserFromToken(context.token);
    if (!user) throw new Error('Não autenticado');

    validate(schemas.devotional, devotional);
    const clean = sanitizeObject(devotional);

    const { data, error } = await supabase
      .from('devotionals')
      .insert([{ ...clean, user_id: user.id }])
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },

  createGroup: async ({ group }, context) => {
    const user = await getUserFromToken(context.token);
    if (!user) throw new Error('Não autenticado');

    validate(schemas.group, group);
    const clean = sanitizeObject(group);

    const inviteCode = clean.invite_code || generateInviteCode();

    const { data: newGroup, error } = await supabase
      .from('groups')
      .insert([{ ...clean, invite_code: inviteCode, created_by: user.id }])
      .select('*')
      .single();

    if (error) throw error;

    await supabase
      .from('group_members')
      .insert([{ group_id: newGroup.id, user_id: user.id, role: 'Líder' }]);

    return newGroup;
  },

  joinGroup: async ({ inviteCode }, context) => {
    const user = await getUserFromToken(context.token);
    if (!user) throw new Error('Não autenticado');

    validate(schemas.joinGroup, { inviteCode });

    const { data: group, error: groupError } = await supabase
      .from('groups')
      .select('*')
      .eq('invite_code', inviteCode.toUpperCase())
      .single();

    if (groupError || !group) throw new Error('Código de convite inválido');

    const { data: existing } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', group.id)
      .eq('user_id', user.id)
      .single();

    if (existing) throw new Error('Você já participa deste grupo');

    const { error } = await supabase
      .from('group_members')
      .insert([{ group_id: group.id, user_id: user.id, role: 'Participante' }]);

    if (error) throw error;
    return group;
  }
};

module.exports = schema;
module.exports.root = root;