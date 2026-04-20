import { supabase } from './supabase';

export const API_BASE = import.meta.env.VITE_API_URL;

const apiFetch = async (path: string, init?: RequestInit): Promise<Response> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers: HeadersInit = {
    ...(init?.headers ?? {}),
    ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
  };

  return fetch(`${API_BASE}${path}`, { ...init, headers });
};

export const apiGet = async <T>(path: string): Promise<T | null> => {
  try {
    const res = await apiFetch(path);
    if (!res.ok) {
      console.error(`GET ${path} → ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error(`GET ${path}`, err);
    return null;
  }
};

export const apiPatch = async <T>(path: string, body: unknown): Promise<T | null> => {
  try {
    const res = await apiFetch(path, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.error(`PATCH ${path} → ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error(`PATCH ${path}`, err);
    return null;
  }
};

export const apiPatchForm = async <T>(path: string, form: FormData): Promise<T | null> => {
  try {
    const res = await apiFetch(path, { method: 'PATCH', body: form });
    if (!res.ok) {
      console.error(`PATCH (form) ${path} → ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error(`PATCH (form) ${path}`, err);
    return null;
  }
};

export const apiPost = async <T>(path: string, body: unknown): Promise<T | null> => {
  try {
    const res = await apiFetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.error(`POST ${path} → ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error(`POST ${path}`, err);
    return null;
  }
};

export const apiDelete = async (path: string): Promise<boolean> => {
  try {
    const res = await apiFetch(path, { method: 'DELETE' });
    if (!res.ok) {
      console.error(`DELETE ${path} → ${res.status}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`DELETE ${path}`, err);
    return false;
  }
};
