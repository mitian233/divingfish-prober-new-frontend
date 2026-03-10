<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const authStore = useAuthStore()
const open = shallowRef(false)
const loading = shallowRef(false)

async function fetchAgreementStatus() {
  if (!authStore.isLoggedIn) return
  try {
    const resp = await api.get('/maimaidxprober/player/agreement') as { accept_agreement?: boolean }
    if (!resp?.accept_agreement) {
      open.value = true
    }
  } catch {
    // ignore fetch failure in UI
  }
}

async function agree() {
  loading.value = true
  try {
    await api.post('/maimaidxprober/player/agreement', { accept_agreement: true })
    toast.success('已同意用户协议')
    open.value = false
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchAgreementStatus()
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button variant="outline">用户协议</Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[720px] max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>用户协议</DialogTitle>
      </DialogHeader>
      <div class="space-y-3 text-sm leading-6">
        <p>1. 为使用完整账号功能，需注册账号并妥善保管密码。</p>
        <p>2. 公开成绩信息存在被利用风险，请谨慎设置隐私选项。</p>
        <p>3. 我们将采用合理措施保护信息安全，但无法完全消除网络风险。</p>
        <p>4. 本协议适用中华人民共和国相关法律法规。</p>
        <p class="text-red-500">不同意协议将无法完整使用部分账号功能。</p>
      </div>
      <DialogFooter>
        <Button variant="outline" @click="open = false">稍后再说</Button>
        <Button :disabled="loading" @click="agree">
          {{ loading ? '提交中...' : '我同意' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
