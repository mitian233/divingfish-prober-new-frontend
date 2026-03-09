import api from '@/lib/api'
import type { MaimaiRecord } from '@/features/maimai/types'

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
  records?: MaimaiRecord[]
}

export interface LoginResponse {
  message: string
}

export interface RegisterResponse {
  message: string
}

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    return api.post('/maimaidxprober/login', data)
  },

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    return api.post('/maimaidxprober/register', data)
  },

  async sendFeedback(message: string): Promise<void> {
    return api.post('/maimaidxprober/feedback', { message })
  },
}
