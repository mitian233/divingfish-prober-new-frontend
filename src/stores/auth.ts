import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/features/auth/services/authService'
import { deleteCookie } from '@/lib/api'
import type { MaimaiRecord } from '@/features/maimai/types'

export const useAuthStore = defineStore('auth', () => {
  const username = ref<string>('未登录')
  const loading = ref<boolean>(false)

  const isLoggedIn = computed(() => username.value !== '未登录')

  function setUsername(name: string) {
    username.value = name
  }

  async function login(user: string, password: string) {
    loading.value = true
    try {
      await authService.login({ username: user, password })
      username.value = user
      return true
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function register(user: string, password: string, records?: MaimaiRecord[]) {
    loading.value = true
    try {
      await authService.register({ username: user, password, records })
      username.value = user
      return true
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  function logout() {
    username.value = '未登录'
    deleteCookie('jwt_token')
  }

  return {
    username,
    isLoggedIn,
    loading,
    setUsername,
    login,
    register,
    logout,
  }
})
