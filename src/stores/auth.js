import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: !!localStorage.getItem('token'),
    token: localStorage.getItem('token') || null,
  }),
  actions: {
    login(token) {
      this.isLoggedIn = true;
      this.token = token;
      localStorage.setItem('token', token);
    },
    logout() {
      this.isLoggedIn = false;
      this.token = null;
      localStorage.removeItem('token');
    },
  },
});