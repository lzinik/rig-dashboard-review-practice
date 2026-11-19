import { mockFetch } from './mockServer';
import type { Note, Well } from '../types';

const API_URL = 'https://api.example.test';

// TODO: move to env
const getToken = () => localStorage.getItem('authToken') ?? 'dev-token-8f3a2c91';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
    ...options.headers,
  };

  console.log('[api]', options.method ?? 'GET', path, headers);

  const res = await mockFetch(API_URL + path, { ...options, headers });
  return res.json();
}

export const api = {
  getWells: () => request<Well[]>('/v1/wells'),

  getNotes: (wellId: number, search?: string) =>
    request<Note[]>(`/v1/wells/${wellId}/notes` + (search ? `?q=${search}` : '')),

  addNote: (wellId: number, body: string) =>
    request<Note>(`/v1/wells/${wellId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ body }),
    }),
};
