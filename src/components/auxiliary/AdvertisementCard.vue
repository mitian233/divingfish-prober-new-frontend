<script setup lang="ts">
import { computed, onMounted, onUnmounted, shallowRef } from 'vue'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface AdvertisementItem {
  s: string
  l?: string
}

const items = shallowRef<AdvertisementItem[]>([])
const index = shallowRef(0)
let timer: ReturnType<typeof setInterval> | null = null

const current = computed(() => items.value[index.value] || null)

function next() {
  if (items.value.length <= 1) return
  index.value = (index.value + 1) % items.value.length
}

function prev() {
  if (items.value.length <= 1) return
  index.value = (index.value - 1 + items.value.length) % items.value.length
}

function startAutoPlay() {
  if (timer) clearInterval(timer)
  timer = setInterval(() => next(), 5000)
}

onMounted(async () => {
  try {
    const resp = await api.get('/maimaidxprober/advertisements') as AdvertisementItem[]
    items.value = Array.isArray(resp) ? resp : []
    index.value = 0
    if (items.value.length > 1) {
      startAutoPlay()
    }
  } catch {
    items.value = []
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>推荐内容</CardTitle>
    </CardHeader>
    <CardContent class="space-y-3">
      <div v-if="current" class="rounded-md border overflow-hidden bg-muted/20">
        <a v-if="current.l" :href="current.l" target="_blank" rel="noreferrer">
          <img :src="current.s" alt="advertisement" class="w-full object-contain">
        </a>
        <img v-else :src="current.s" alt="advertisement" class="w-full object-contain">
      </div>
      <p v-else class="text-sm text-muted-foreground">暂无广告内容</p>

      <div v-if="items.length > 1" class="flex items-center justify-between">
        <Button size="sm" variant="outline" @click="prev">上一张</Button>
        <span class="text-xs text-muted-foreground">{{ index + 1 }} / {{ items.length }}</span>
        <Button size="sm" variant="outline" @click="next">下一张</Button>
      </div>
    </CardContent>
  </Card>
</template>
