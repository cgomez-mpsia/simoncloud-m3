const BASE = 'http://localhost:3001/api';

async function req<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options.headers as Record<string, string>) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? 'Error del servidor');
  }
  return res.json();
}

export interface AuthUser { id: string; name: string; email: string; role: string; }
export interface Drop { id: string; name: string; description?: string; status: string; docenteId?: string; docente?: { name: string }; createdAt: string; _count: { files: number }; }
export interface FileRecord { id: string; filename: string; sizeBytes: string; mimeType: string; sha256Hash: string; status: string; publicUrl: string; uploadedAt: string; uploader?: { name: string }; }

export const api = {
  login: (email: string, password: string) =>
    req<{ token: string; user: AuthUser }>('/auth/login', {
      method: 'POST', body: JSON.stringify({ email, password }),
    }),

  listDrops: (token: string) => req<Drop[]>('/drops', {}, token),

  createDrop: (name: string, description: string, token: string) =>
    req<Drop>('/drops', { method: 'POST', body: JSON.stringify({ name, description }) }, token),

  getDrop: (id: string, token: string) => req<Drop>(`/drops/${id}`, {}, token),

  closeDrop: (id: string, token: string) =>
    req<Drop>(`/drops/${id}/close`, { method: 'PATCH' }, token),

  deleteDrop: (id: string, token: string) =>
    req<void>(`/drops/${id}`, { method: 'DELETE' }, token),

  listFiles: (dropId: string, token: string) =>
    req<FileRecord[]>(`/drops/${dropId}/files`, {}, token),

  uploadFile: async (dropId: string, file: File, token: string): Promise<FileRecord> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${BASE}/drops/${dropId}/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) { const e = await res.json(); throw new Error(e.message); }
    return res.json();
  },

  deleteFile: (fileId: string, token: string) =>
    req<void>(`/files/${fileId}`, { method: 'DELETE' }, token),
};
