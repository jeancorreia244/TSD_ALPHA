import { useState, useCallback, useMemo } from 'react';
import { graphql, mutations } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

export function useGroups() {
  const { session } = useAuth();
  const { addGroup, updateGroup, groups } = useData();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [focus, setFocus] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = useCallback(() => {
    setName('');
    setDescription('');
    setFocus('');
    setInviteCode('');
    setFeedback('');
  }, []);

  const resetJoinForm = useCallback(() => {
    setJoinCode('');
    setFeedback('');
  }, []);

  const createGroup = useCallback(async () => {
    if (!name.trim()) {
      setFeedback('Nome do grupo é obrigatório');
      return;
    }

    if (!session?.token) {
      setFeedback('Você precisa estar logado para criar grupo');
      return;
    }

    setIsSaving(true);
    setFeedback('Criando grupo...');

    try {
      const input = {
        name: name.trim(),
        description: description.trim() || null,
        focus: focus.trim() || null,
        invite_code: inviteCode.trim() || null
      };

      const response = await graphql(mutations.createGroup, { group: input }, session.token);
      const savedGroup = response.createGroup;

      addGroup(savedGroup);
      setFeedback('Grupo criado com sucesso!');

      setTimeout(() => resetForm(), 1500);
    } catch (err) {
      console.error('Erro ao criar grupo:', err);
      setFeedback('Erro ao criar grupo: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  }, [name, description, focus, inviteCode, session?.token, addGroup, resetForm]);

  const joinGroup = useCallback(async () => {
    if (!joinCode.trim()) {
      setFeedback('Código de convite é obrigatório');
      return;
    }

    if (!session?.token) {
      setFeedback('Você precisa estar logado para entrar no grupo');
      return;
    }

    setIsSaving(true);
    setFeedback('Entrando no grupo...');

    try {
      const response = await graphql(mutations.joinGroup, { inviteCode: joinCode.trim().toUpperCase() }, session.token);
      const joinedGroup = response.joinGroup;

      // Atualizar lista de grupos
      updateGroup(joinedGroup);
      setFeedback('Você entrou no grupo com sucesso!');

      setTimeout(() => resetJoinForm(), 1500);
    } catch (err) {
      console.error('Erro ao entrar no grupo:', err);
      setFeedback('Erro ao entrar no grupo: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  }, [joinCode, session?.token, updateGroup, resetJoinForm]);

  // Estatísticas
  const myGroups = useMemo(() => {
    if (!session?.user?.id) return [];
    return groups.filter(g =>
      g.created_by === session.user.id ||
      g.group_members?.some(m => m.user_id === session.user.id)
    );
  }, [groups, session?.user?.id]);

  const createdGroups = useMemo(() => {
    if (!session?.user?.id) return [];
    return groups.filter(g => g.created_by === session.user.id);
  }, [groups, session?.user?.id]);

  const joinedGroups = useMemo(() => {
    if (!session?.user?.id) return [];
    return groups.filter(g =>
      g.group_members?.some(m => m.user_id === session.user.id && g.created_by !== session.user.id)
    );
  }, [groups, session?.user?.id]);

  const totalMembers = useMemo(() => {
    return myGroups.reduce((sum, g) => sum + (g.group_members?.length || 0), 0);
  }, [myGroups]);

  const averageProgress = useMemo(() => {
    if (myGroups.length === 0) return 0;
    const total = myGroups.reduce((sum, g) => sum + (g.progress || 0), 0);
    return Math.round(total / myGroups.length);
  }, [myGroups]);

  const groupStats = useMemo(() => {
    return {
      total: groups.length,
      myGroups: myGroups.length,
      created: createdGroups.length,
      joined: joinedGroups.length,
      totalMembers,
      averageProgress
    };
  }, [groups.length, myGroups.length, createdGroups.length, joinedGroups.length, totalMembers, averageProgress]);

  const getGroupRole = useCallback((group) => {
    if (!session?.user?.id) return null;
    if (group.created_by === session.user.id) return 'Líder';

    const member = group.group_members?.find(m => m.user_id === session.user.id);
    return member?.role || null;
  }, [session?.user?.id]);

  const getMemberCount = useCallback((group) => {
    return group.group_members?.length || 0;
  }, []);

  const getGroupProgress = useCallback((group) => {
    return group.progress || 0;
  }, []);

  const searchGroups = useCallback((query) => {
    if (!query) return groups;

    const lowerQuery = query.toLowerCase();
    return groups.filter(g =>
      g.name.toLowerCase().includes(lowerQuery) ||
      g.description?.toLowerCase().includes(lowerQuery) ||
      g.focus?.toLowerCase().includes(lowerQuery) ||
      g.invite_code?.toLowerCase().includes(lowerQuery)
    );
  }, [groups]);

  const formatInviteCode = useCallback((code) => {
    if (!code) return '';
    return code.toUpperCase();
  }, []);

  const validateInviteCode = useCallback((code) => {
    const regex = /^G-[A-Z0-9]{6}$/;
    return regex.test(code.toUpperCase());
  }, []);

  const recentGroups = useMemo(() => {
    return [...myGroups]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);
  }, [myGroups]);

  const groupsByProgress = useMemo(() => {
    return [...myGroups].sort((a, b) => (b.progress || 0) - (a.progress || 0));
  }, [myGroups]);

  return {
    // Form states
    name,
    setName,
    description,
    setDescription,
    focus,
    setFocus,
    inviteCode,
    setInviteCode,
    joinCode,
    setJoinCode,

    // Actions
    createGroup,
    joinGroup,
    resetForm,
    resetJoinForm,

    // UI states
    feedback,
    isSaving,

    // Data
    groups,
    myGroups,
    createdGroups,
    joinedGroups,
    groupStats,

    // Helpers
    getGroupRole,
    getMemberCount,
    getGroupProgress,
    searchGroups,
    formatInviteCode,
    validateInviteCode,

    // Computed
    recentGroups,
    groupsByProgress,
    totalMembers,
    averageProgress
  };
}

export default useGroups;
