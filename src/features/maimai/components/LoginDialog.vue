<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [boolean]
  'register': []
}>()

const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)

const isValid = computed(() => username.value.length > 0 && password.value.length > 0)

async function handleLogin() {
  if (!isValid.value) {
    toast.error('请填写用户名和密码')
    return
  }
  
  loading.value = true
  try {
    await authStore.login(username.value, password.value)
    toast.success('登录成功!')
    emit('update:open', false)
    username.value = ''
    password.value = ''
    setTimeout(() => window.location.reload(), 500)
  } catch (error: any) {
    toast.error(error.response?.data?.message || '登录失败')
  } finally {
    loading.value = false
  }
}

function closeDialog() {
  emit('update:open', false)
}

function openRegister() {
  emit('update:open', false)
  emit('register')
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>登录</DialogTitle>
        <DialogDescription>
          登录以同步您的成绩数据
        </DialogDescription>
      </DialogHeader>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div class="space-y-2">
          <Label for="login-username">用户名</Label>
          <Input
            id="login-username"
            v-model="username"
            type="text"
            placeholder="请输入用户名"
            autocomplete="username"
          />
        </div>
        <div class="space-y-2">
          <Label for="login-password">密码</Label>
          <Input
            id="login-password"
            v-model="password"
            type="password"
            placeholder="请输入密码"
            autocomplete="current-password"
          />
        </div>
      </form>
      <DialogFooter class="gap-2 sm:gap-0">
        <Button variant="outline" @click="openRegister">立即注册</Button>
        <Button variant="outline" @click="closeDialog">取消</Button>
        <Button :disabled="loading || !isValid" @click="handleLogin">
          {{ loading ? '登录中...' : '登录' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
