import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
    token: null,
  }),

  getters: {
    getToken: (state) => state.token,
  },

  actions: {
    initializeAuth() {
      // Cargar el token almacenado si existe
      const storedToken = localStorage.getItem("access_token"); // ⚡ Ahora busca "access_token"
      if (storedToken) {
        this.token = storedToken;
        this.isAuthenticated = true;
      }
    },

    login(token) {
      localStorage.setItem("access_token", token); // ⚡ Guarda "access_token" en localStorage
      this.token = token;
      this.isAuthenticated = true;
    },

    logout() {
      localStorage.removeItem("access_token"); // ⚡ Elimina "access_token" en vez de "token"
      this.token = null;
      this.isAuthenticated = false;
    },
  },
});
