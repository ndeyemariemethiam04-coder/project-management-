import { create } from 'zustand';
import api from '../api/axios';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,

  fetchMe: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      if (get().isAuthenticated) set({ user: null, token: null, isAuthenticated: false });
      return;
    }
    
    // Only show loading if we don't have user data yet
    if (!get().user) set({ isLoading: true });
    
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data, token, isAuthenticated: true });
    } catch (err) {
      console.error("fetchMe failed", err);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null, token: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
  
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { user, token } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
    return user;
  },
  
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    const { user, token } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
    return user;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
    // Optional: window.location.href = '/login'; // Force reload to clear all states
  }
}));

export default useAuthStore;
