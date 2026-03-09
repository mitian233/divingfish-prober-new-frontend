import { createPinia } from 'pinia'

export const pinia = createPinia()

export * from './auth'
export { useMaimaiStore } from '@/features/maimai/store/maimaiStore'
export { useChuniStore } from '@/features/chuni/store/chuniStore'
