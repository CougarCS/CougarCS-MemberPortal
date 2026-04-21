import { supabase } from './supabase';

export const API_BASE = import.meta.env.VITE_API_URL;

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

const buildUrl = (path: string) => {
  return `${API_BASE}${path}`;
};

const getAuthHeaders = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    return {};
  }

  return { Authorization: `Bearer ${session.access_token}` };
};

const parseErrorBody = async (response: Response) => {
  const contentType = response.headers.get('content-type') ?? '';

  try {
    if (contentType.includes('application/json')) {
      const data = (await response.json()) as { error?: string; message?: string };
      return data.message ?? data.error ?? JSON.stringify(data);
    }

    const text = await response.text();
    return text || response.statusText;
  } catch {
    return response.statusText;
  }
};

const parseJsonBody = async <T>(response: Response): Promise<T | null> => {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return null;
  }

  return (await response.json()) as T;
};

const request = async (method: HttpMethod, path: string, init?: RequestInit) => {
  const authHeaders = await getAuthHeaders();
  const headers = new Headers(init?.headers);

  Object.entries(authHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });

  try {
    return await fetch(buildUrl(path), {
      ...init,
      method,
      headers,
    });
  } catch (error) {
    console.error(`[api] ${method} ${path} failed`, error);
    return null;
  }
};

const requestJson = async <T>(method: HttpMethod, path: string, init?: RequestInit) => {
  const response = await request(method, path, init);

  if (!response) {
    return null;
  }

  if (!response.ok) {
    const errorBody = await parseErrorBody(response);
    console.error(`[api] ${method} ${path} failed (${response.status})`, errorBody);
    return null;
  }

  return parseJsonBody<T>(response);
};

export const apiGet = async <T>(path: string): Promise<T | null> => {
  return requestJson<T>('GET', path);
};

export const apiPatch = async <T>(path: string, body: unknown): Promise<T | null> => {
  return requestJson<T>('PATCH', path, {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
};

export const apiPatchForm = async <T>(path: string, form: FormData): Promise<T | null> => {
  return requestJson<T>('PATCH', path, { body: form });
};

export const apiPost = async <T>(path: string, body: unknown): Promise<T | null> => {
  return requestJson<T>('POST', path, {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
};

export const apiDelete = async (path: string): Promise<boolean> => {
  const response = await request('DELETE', path);

  if (!response) {
    return false;
  }

  if (!response.ok) {
    const errorBody = await parseErrorBody(response);
    console.error(`[api] DELETE ${path} failed (${response.status})`, errorBody);
    return false;
  }

  return true;
};
