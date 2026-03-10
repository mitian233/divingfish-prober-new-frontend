<script setup lang="ts">
import { onMounted } from 'vue'
import { useMaimaiStore } from '@/features/maimai/store/maimaiStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ViewBadgeCard from '@/components/auxiliary/ViewBadgeCard.vue'
import MessageBoardCard from '@/components/auxiliary/MessageBoardCard.vue'
import AdvertisementCard from '@/components/auxiliary/AdvertisementCard.vue'
import VoteBoxDialog from '@/components/auxiliary/VoteBoxDialog.vue'

const maimaiStore = useMaimaiStore()

onMounted(async () => {
  if (maimaiStore.musicData.length === 0) {
    try {
      await maimaiStore.fetchMusicData()
    } catch {
      // keep overview usable even if fetch fails
    }
  }
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold">总览</h1>
      <p class="text-muted-foreground">欢迎使用 maimaidx-prober</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <ViewBadgeCard />
      <Card class="lg:col-span-2">
        <CardHeader>
          <CardTitle>互动</CardTitle>
          <CardDescription>投票与社区互动功能入口。</CardDescription>
        </CardHeader>
        <CardContent class="flex flex-wrap gap-3">
          <VoteBoxDialog :music-data="maimaiStore.musicData" />
        </CardContent>
      </Card>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-2">
        <MessageBoardCard />
      </div>
      <AdvertisementCard />
    </div>
  </div>
</template>
