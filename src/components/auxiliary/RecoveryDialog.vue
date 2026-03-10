<script setup lang="ts">
import { shallowRef } from 'vue'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const open = shallowRef(false)
const loading = shallowRef(false)
const bindQQ = shallowRef('')

async function submitRecovery() {
  if (!bindQQ.value.trim()) {
    toast.error('QQ号不能为空')
    return
  }

  loading.value = true
  try {
    await api.post(`/maimaidxprober/recovery?qq=${encodeURIComponent(bindQQ.value.trim())}`)
    toast.success('邮件已发送')
    open.value = false
    bindQQ.value = ''
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button variant="outline">重置账户</Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[460px]">
      <DialogHeader>
        <DialogTitle>重置账户</DialogTitle>
      </DialogHeader>
      <div class="space-y-3">
        <p class="text-sm text-muted-foreground">
          该功能仅限绑定 QQ 的账户使用，系统会向对应 QQ 邮箱发送重置邮件。
        </p>
        <div class="space-y-2">
          <Label for="recovery-qq">QQ号</Label>
          <Input id="recovery-qq" v-model="bindQQ" placeholder="请输入绑定的QQ号" />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" @click="open = false">取消</Button>
        <Button :disabled="loading" @click="submitRecovery">
          {{ loading ? '发送中...' : '发送邮件' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
