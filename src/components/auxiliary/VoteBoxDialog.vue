<script setup lang="ts">
import { computed, watch, shallowRef } from 'vue'
import api from '@/lib/api'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { MaimaiMusicData } from '@/features/maimai/types'
import { getCoverPathById } from '@/features/maimai/domain/recordCalculator'

const props = defineProps<{
  musicData: MaimaiMusicData[]
}>()

const open = shallowRef(false)
const loading = shallowRef(false)
const autoOpen = shallowRef(localStorage.getItem('maiprober_vote_auto_open') !== 'false')
const remain = shallowRef(Number(localStorage.getItem('maiprober_vote_remain') || 5))
const voteToken = shallowRef('')
const leftId = shallowRef<number | null>(null)
const rightId = shallowRef<number | null>(null)
const alertText = shallowRef('')

const musicMap = computed(() => {
  const map = new Map<number, MaimaiMusicData>()
  for (const item of props.musicData) map.set(item.id, item)
  return map
})

const leftMusic = computed(() => (leftId.value !== null ? musicMap.value.get(leftId.value) : null))
const rightMusic = computed(() => (rightId.value !== null ? musicMap.value.get(rightId.value) : null))

function syncStorage() {
  localStorage.setItem('maiprober_vote_auto_open', String(autoOpen.value))
  localStorage.setItem('maiprober_vote_remain', String(remain.value))
  localStorage.setItem('maiprober_vote_timestamp', String(Date.now()))
}

async function getNewVote(forceReset = false) {
  if (forceReset) {
    remain.value = 5
    syncStorage()
  }
  try {
    const resp = await api.get('/maimaidxprober/vote_box') as { left: number; right: number; token: string }
    leftId.value = resp.left
    rightId.value = resp.right
    voteToken.value = resp.token
  } catch {
    // keep old pair
  }
}

async function vote(value: 0 | 1 | 2 | 3) {
  if (!voteToken.value) return
  loading.value = true
  try {
    const resp = await api.post('/maimaidxprober/vote_box', {
      token: voteToken.value,
      vote: value,
    }) as { result: [number, number] }

    const [leftRank, rightRank] = resp.result || [0, 0]
    if (value === 1 && leftMusic.value && rightMusic.value) {
      alertText.value = `你投给了 ${leftMusic.value.title}（第 ${leftRank} 位），${rightMusic.value.title} 当前第 ${rightRank} 位。`
    } else if (value === 2 && leftMusic.value && rightMusic.value) {
      alertText.value = `你投给了 ${rightMusic.value.title}（第 ${rightRank} 位），${leftMusic.value.title} 当前第 ${leftRank} 位。`
    } else if (value === 0) {
      alertText.value = '你选择了跳过。'
    } else {
      alertText.value = `你选择“两首都不行”，当前排名：${leftRank} / ${rightRank}。`
    }

    remain.value = Math.max(remain.value - 1, 0)
    syncStorage()
    if (remain.value > 0) {
      await getNewVote()
    }
  } catch (error: any) {
    toast.error(error?.response?.data?.message || '投票失败')
    await getNewVote()
  } finally {
    loading.value = false
  }
}

watch(
  () => props.musicData.length,
  async (len) => {
    if (len <= 0) return
    const timestamp = Number(localStorage.getItem('maiprober_vote_timestamp') || 0)
    if (!timestamp || Date.now() - timestamp > 86400000) {
      remain.value = 5
      syncStorage()
    }
    if (autoOpen.value && remain.value > 0) {
      open.value = true
    }
    await getNewVote()
  },
  { immediate: true }
)
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button variant="outline">投票箱</Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[760px]">
      <DialogHeader>
        <DialogTitle>舞萌投票箱</DialogTitle>
      </DialogHeader>

      <div v-if="alertText" class="rounded-md border p-3 text-sm bg-muted/40">
        {{ alertText }}
      </div>

      <template v-if="remain > 0">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2" v-if="leftMusic">
            <p class="text-sm font-medium truncate">{{ leftMusic.title }}</p>
            <img :src="`/covers/${getCoverPathById(leftMusic.id)}`" class="w-full rounded border">
            <Button class="w-full" :disabled="loading" @click="vote(1)">投给左边</Button>
          </div>
          <div class="space-y-2" v-if="rightMusic">
            <p class="text-sm font-medium truncate">{{ rightMusic.title }}</p>
            <img :src="`/covers/${getCoverPathById(rightMusic.id)}`" class="w-full rounded border">
            <Button class="w-full" :disabled="loading" @click="vote(2)">投给右边</Button>
          </div>
        </div>
      </template>
      <p v-else class="text-sm text-muted-foreground">
        今日已投满 5 组，可明天再来，或点击“继续投票”强制刷新。
      </p>

      <DialogFooter class="gap-2">
        <Button variant="outline" :disabled="loading" @click="vote(0)">跳过</Button>
        <Button variant="outline" :disabled="loading" @click="vote(3)">给爷整乐了</Button>
        <Button variant="outline" :disabled="loading" @click="getNewVote(true)">继续投票</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
