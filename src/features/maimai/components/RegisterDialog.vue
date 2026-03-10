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
import type { MaimaiRecord } from '../types'

const props = defineProps<{
  open: boolean
  records?: MaimaiRecord[]
}>()

const emit = defineEmits<{
  'update:open': [boolean]
}>()

const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const passwordConfirm = ref('')
const loading = ref(false)

const isValid = computed(() => {
  return (
    username.value.length >= 4 &&
    password.value.length > 0 &&
    password.value === passwordConfirm.value
  )
})

async function handleRegister() {
  if (username.value.length < 4) {
    toast.error('用户名至少长 4 个字符')
    return
  }
  if (password.value !== passwordConfirm.value) {
    toast.error('两次密码不一致')
    return
  }
  
  loading.value = true
  try {
    await authStore.register(username.value, password.value, props.records)
    toast.success('注册成功，数据已同步完成')
    emit('update:open', false)
    username.value = ''
    password.value = ''
    passwordConfirm.value = ''
    setTimeout(() => window.location.reload(), 1000)
  } catch (error: any) {
    toast.error(error.response?.data?.message || '注册失败')
  } finally {
    loading.value = false
  }
}

function closeDialog() {
  emit('update:open', false)
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>注册</DialogTitle>
        <DialogDescription>
          注册后会自动同步当前已导入的乐曲数据
        </DialogDescription>
      </DialogHeader>
      <form @submit.prevent="handleRegister" class="space-y-4">
        <div class="space-y-2">
          <Label for="register-username">用户名</Label>
          <Input
            id="register-username"
            v-model="username"
            type="text"
            placeholder="请输入用户名（至少4个字符）"
            autocomplete="username"
          />
        </div>
        <div class="space-y-2">
          <Label for="register-password">密码</Label>
          <Input
            id="register-password"
            v-model="password"
            type="password"
            placeholder="请输入密码"
            autocomplete="new-password"
          />
        </div>
        <div class="space-y-2">
          <Label for="register-password-confirm">确认密码</Label>
          <Input
            id="register-password-confirm"
            v-model="passwordConfirm"
            type="password"
            placeholder="请再次输入密码"
            autocomplete="new-password"
          />
        </div>
      </form>
      <DialogFooter class="gap-2">
        <Button variant="outline" @click="closeDialog">取消</Button>
        <Button :disabled="loading || !isValid" @click="handleRegister">
          {{ loading ? '注册中...' : '注册' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
