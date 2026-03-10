<script setup lang="ts">
import { onMounted, shallowRef, computed } from 'vue'
import api from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const rawViews = shallowRef(0)
const views = computed(() => rawViews.value.toLocaleString())

onMounted(async () => {
  try {
    const resp = await api.get('/maimaidxprober/count_view') as { views?: number }
    rawViews.value = Number(resp?.views || 0)
  } catch {
    rawViews.value = 0
  }
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-base">访问量</CardTitle>
    </CardHeader>
    <CardContent>
      <img
        v-if="rawViews > 0"
        :src="`https://img.shields.io/badge/views-${views}-blue`"
        alt="views"
      >
      <p v-else class="text-sm text-muted-foreground">暂无访问量数据</p>
    </CardContent>
  </Card>
</template>
