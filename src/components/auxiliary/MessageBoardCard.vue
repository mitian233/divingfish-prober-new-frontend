<script setup lang="ts">
import { computed, onMounted, shallowRef } from 'vue'
import api from '@/lib/api'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface MessageItem {
  username?: string
  nickname?: string
  text: string
  ts?: number
}

const messages = shallowRef<MessageItem[]>([])
const index = shallowRef(0)
const text = shallowRef('')
const nickname = shallowRef('')
const submitOpen = shallowRef(false)
const loading = shallowRef(false)

const current = computed(() => messages.value[index.value] || null)

function clampIndex() {
  if (messages.value.length === 0) {
    index.value = 0
    return
  }
  if (index.value < 0) index.value = 0
  if (index.value > messages.value.length - 1) index.value = messages.value.length - 1
}

async function fetchMessages() {
  try {
    const resp = await api.get('/maimaidxprober/message') as MessageItem[]
    messages.value = Array.isArray(resp) ? resp.sort((a, b) => (a.ts || 0) - (b.ts || 0)) : []
    clampIndex()
  } catch {
    messages.value = []
  }
}

async function submitMessage() {
  if (!text.value.trim()) {
    toast.error('消息不能为空')
    return
  }
  if (text.value.length > 60) {
    toast.error('一条消息最多 60 个字符')
    return
  }
  if (nickname.value.length > 20) {
    toast.error('马甲最多 20 个字符')
    return
  }
  loading.value = true
  try {
    const resp = await api.post('/maimaidxprober/message', {
      nickname: nickname.value.trim(),
      text: text.value.trim(),
    }) as MessageItem[]
    if (Array.isArray(resp)) {
      messages.value = resp.sort((a, b) => (a.ts || 0) - (b.ts || 0))
      index.value = Math.max(messages.value.length - 1, 0)
    } else {
      await fetchMessages()
      index.value = Math.max(messages.value.length - 1, 0)
    }
    text.value = ''
    nickname.value = ''
    submitOpen.value = false
    toast.success('留言已发送')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchMessages()
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>今日留言</CardTitle>
      <CardDescription>吹水，扩列，或者……？</CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <div v-if="current" class="rounded-md border p-4 min-h-[132px] flex flex-col justify-between">
        <div>
          <p class="font-semibold">{{ current.nickname || current.username || '匿名用户' }}</p>
          <p class="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">{{ current.text }}</p>
        </div>
        <div class="flex items-center justify-between mt-4">
          <Button size="sm" variant="outline" :disabled="index <= 0" @click="index--">上一条</Button>
          <span class="text-xs text-muted-foreground">{{ index + 1 }} / {{ messages.length }}</span>
          <Button size="sm" variant="outline" :disabled="index >= messages.length - 1" @click="index++">下一条</Button>
        </div>
      </div>
      <p v-else class="text-sm text-muted-foreground">暂无留言</p>

      <div class="flex gap-2">
        <Input v-model="text" placeholder="说两句..." />
        <Dialog v-model:open="submitOpen">
          <DialogTrigger as-child>
            <Button>发送</Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-[420px]">
            <DialogHeader>
              <DialogTitle>使用什么马甲发送？</DialogTitle>
            </DialogHeader>
            <div class="space-y-2">
              <Label for="msg-nick">马甲（可空）</Label>
              <Input id="msg-nick" v-model="nickname" placeholder="空着则使用用户名" />
            </div>
            <DialogFooter>
              <Button variant="outline" @click="submitOpen = false">取消</Button>
              <Button :disabled="loading" @click="submitMessage">{{ loading ? '发送中...' : '确认发送' }}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </CardContent>
  </Card>
</template>
