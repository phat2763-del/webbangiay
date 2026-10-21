import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user_info')) || null
  }),
  getters: {
    isLoggedIn: (state) => !!state.user,
    isAdmin: (state) => state.user?.isAdmin === true
  },
  actions: {
    setUser(userData) {
      this.user = userData
      localStorage.setItem('user_info', JSON.stringify(userData))
    },
    logout() {
      this.user = null
      localStorage.removeItem('user_info')
    }
  }
})