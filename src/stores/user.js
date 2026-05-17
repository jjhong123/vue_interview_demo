import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('user_token') || null,
    userInfo: JSON.parse(localStorage.getItem('user_info')) || { username: '' },
  }),
  actions: {
    async login(payload) {
      if (payload.username === 'admin' && payload.password === '123456') {
        this.token = 'fake-token-123'
        this.userInfo = { username: 'Admin' }
        localStorage.setItem('user_token', this.token)
        localStorage.setItem('user_info', JSON.stringify(this.userInfo))
      } else {
        throw new Error('Login Failed')
      }
    },
    logout() {
      this.token = null
      this.userInfo = { username: '' }
      localStorage.clear()
    },
  },
})
