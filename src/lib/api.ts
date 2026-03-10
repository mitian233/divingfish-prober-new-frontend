import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { toast } from 'sonner'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getCookie('jwt_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response: AxiosResponse) => {
    const contentType = String(response.headers?.['content-type'] || '').toLowerCase()
    const body = response.data
    const isHtmlText =
      typeof body === 'string' && /^\s*<(?:!doctype\s+html|html)\b/i.test(body)

    if (contentType.includes('text/html') || isHtmlText) {
      const requestUrl = response.config?.url || 'unknown'
      const message = `接口返回 HTML 而非 JSON: ${requestUrl}，请检查 Vite /api 代理或后端路由`
      toast.error(message)
      return Promise.reject(new Error(message))
    }

    return response.data
  },
  (error: AxiosError<any>) => {
    const message = error.response?.data?.message || error.message || '请求失败'
    toast.error(message)
    return Promise.reject(error)
  }
)

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null
  }
  return null
}

export function setCookie(name: string, value: string, days: number = 365): void {
  const d = new Date()
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000)
  const expires = `expires=${d.toUTCString()}`
  document.cookie = `${name}=${value}; ${expires}; path=/`
}

export function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
}

export default api
