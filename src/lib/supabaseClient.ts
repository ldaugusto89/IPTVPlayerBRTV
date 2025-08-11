const SUPABASE_URL = 'https://jvtpitrsterutusdnvbi.supabase.co';
const SUPABASE_KEY = 'sb_publishable_mOy2N5QCZ3pv5-3Fr2k6Kg_3MzCWtzl';


const headers = {
  apikey: SUPABASE_KEY,
  'Content-Type': 'application/json',
};

export async function signIn(email: string, password: string) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, password }),
  });
  return response.json(); // token, user, etc.
}

export async function signUp(email: string, password: string) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}

export async function getUser(token: string) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

// Exemplo de uso com tabela
export async function getFavoritos(token: string, userId: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/favoritos?user_id=eq.${userId}`, {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}