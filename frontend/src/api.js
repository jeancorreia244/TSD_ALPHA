/**
 * Cliente GraphQL centralizado para TSD_ALPHA
 * Gerencia chamadas GraphQL, tokens e erros
 */

const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4001/graphql';

/**
 * Obtém token do localStorage
 */
function getToken() {
  try {
    const stored = localStorage.getItem('tsd_auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed?.token || null;
    }
  } catch {}
  return null;
}

/**
 * Função genérica para chamadas GraphQL
 * @param {string} query - Query/Mutation GraphQL
 * @param {object} variables - Variáveis da query
 * @param {string} token - Token opcional, se não passado pega do storage
 */
export async function graphql(query, variables = {}, token = null) {
  const authToken = (typeof token === 'string' && token) || getToken();

  const headers = {
    'Content-Type': 'application/json'
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables })
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
  }

  if (result.errors) {
    const error = result.errors[0];
    throw new Error(error.message || 'Erro na requisição GraphQL');
  }

  return result.data;
}

/**
 * Queries principais
 */
export const queries = {
  me: `
    query Me {
      me {
        id
        name
        email
        phone
        created_at
      }
    }
  `,

  bibles: `
    query Bibles {
      bibles {
        id
        user_id
        book
        chapter
        verse
        notes
        created_at
      }
    }
  `,

  prayers: `
    query Prayers {
      prayers {
        id
        user_id
        focus
        note
        duration
        created_at
      }
    }
  `,

  fastings: `
    query Fastings {
      fastings {
        id
        user_id
        start_date
        end_date
        duration_hours
        notes
        created_at
      }
    }
  `,

  devotionals: `
    query Devotionals {
      devotionals {
        id
        user_id
        reference
        title
        content
        date
        created_at
      }
    }
  `,

  groups: `
    query Groups {
      groups {
        id
        created_by
        name
        description
        focus
        invite_code
        progress
        created_at
        group_members {
          id
          role
          user {
            id
            name
            email
          }
        }
      }
    }
  `
};

/**
 * Mutations principais
 */
export const mutations = {
  register: `
    mutation Register($name: String!, $email: String!, $password: String!, $phone: String) {
      register(name: $name, email: $email, password: $password, phone: $phone) {
        token
        user { id name email phone created_at }
      }
    }
  `,

  login: `
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
        user { id name email phone created_at }
      }
    }
  `,

  createBible: `
    mutation CreateBible($bible: BibleInput!) {
      createBible(bible: $bible) {
        id
        user_id
        book
        chapter
        verse
        notes
        created_at
      }
    }
  `,

  createPrayer: `
    mutation CreatePrayer($prayer: PrayerInput!) {
      createPrayer(prayer: $prayer) {
        id
        user_id
        focus
        note
        duration
        created_at
      }
    }
  `,

  createFasting: `
    mutation CreateFasting($fasting: FastingInput!) {
      createFasting(fasting: $fasting) {
        id
        user_id
        start_date
        end_date
        duration_hours
        notes
        created_at
      }
    }
  `,

  createDevotional: `
    mutation CreateDevotional($devotional: DevotionalInput!) {
      createDevotional(devotional: $devotional) {
        id
        user_id
        reference
        title
        content
        date
        created_at
      }
    }
  `,

  createGroup: `
    mutation CreateGroup($group: GroupInput!) {
      createGroup(group: $group) {
        id
        name
        description
        focus
        invite_code
        created_at
      }
    }
  `,

  joinGroup: `
    mutation JoinGroup($inviteCode: String!) {
      joinGroup(inviteCode: $inviteCode) {
        id
        name
        invite_code
      }
    }
  `
};

/**
 * Helpers de conveniência
 */
export async function fetchWithAuth(query, variables = {}) {
  return graphql(query, variables);
}

/**
 * Faz logout limpando token
 */
export function logout() {
  localStorage.removeItem('tsd_auth');
}

/**
 * Verifica se usuário está autenticado
 */
export function isAuthenticated() {
  return !!getToken();
}

export default {
  graphql,
  queries,
  mutations,
  fetchWithAuth,
  logout,
  isAuthenticated,
  getToken
};
