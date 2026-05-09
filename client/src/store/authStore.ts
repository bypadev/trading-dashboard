import { create } from 'zustand';
import { API_URL } from '@/consts';
import { AuthState } from './types';

export const useAuthStore = create<AuthState>((set, get) => ({
  token: sessionStorage.getItem('token'),
  username: sessionStorage.getItem('username'),
  error: null,
  isLoading: false,

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        set({ error: 'Invalid username or password', isLoading: false });
        return false;
      }
      const { token, username: user } = await res.json() as { token: string; username: string };
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('username', user);
      set({ token, username: user, isLoading: false });
      return true;
    } catch {
      set({ error: 'Server unreachable', isLoading: false });
      return false;
    }
  },

  logout: async () => {
    const token = get().token;
    if (token) {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    set({ token: null, username: null, error: null });
  },
}));
