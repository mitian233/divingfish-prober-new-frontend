<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useChuniStore } from '@/features/chuni/store/chuniStore'
import { calculateChuniRating } from '@/features/chuni/domain/recordCalculator'
import type { ChuniRecord } from '@/features/chuni/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import FilterSlider from '@/features/maimai/components/FilterSlider.vue'
import ChuniTable from '@/features/chuni/components/ChuniTable.vue'
import ExportDialog from '@/features/chuni/components/ExportDialog.vue'
import UnlockAllDialog from '@/features/chuni/components/UnlockAllDialog.vue'

const chuniStore = useChuniStore()

const tab = ref<'b30' | 'n20'>('b30')
const searchQuery = ref('')
const showExportDialog = ref(false)
const showUnlockAllDialog = ref(false)

const filterRef = ref<InstanceType<typeof FilterSlider> | null>(null)
const filterValue = ref({ min: 1, max: 15, useDs: false })

const b30Records = computed(() => chuniStore.b30Records)
const n20Records = computed(() => chuniStore.n20Records)
const b30Rating = computed(() => chuniStore.b30Rating)
const n20Rating = computed(() => chuniStore.n20Rating)
const totalRating = computed(() => chuniStore.totalRating)

const b30Display = computed(() =>
  b30Records.value.filter((record: ChuniRecord) => {
    if (!filterRef.value) return true
    return filterRef.value.filter(record)
  })
)

const n20Display = computed(() =>
  n20Records.value.filter((record: ChuniRecord) => {
    if (!filterRef.value) return true
    return filterRef.value.filter(record)
  })
)

const isFilterActive = computed(() => {
  return b30Display.value.length !== b30Records.value.length || n20Display.value.length !== n20Records.value.length
})

const filteredB30Rating = computed(() => calculateChuniRating(b30Display.value, 30))
const filteredN20Rating = computed(() => calculateChuniRating(n20Display.value, 20))

async function loadData() {
  try {
    await chuniStore.fetchMusicData()
  } catch (error) {
    console.error('Failed to load chunithm music data:', error)
    return
  }

  try {
    await chuniStore.fetchPlayerRecords()
  } catch (error) {
    console.log('No chunithm player records')
  }
}

function handleUnlockAll() {
  chuniStore.unlockAllRecords()
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold">中二节奏</h1>
      <p class="text-muted-foreground">中二节奏成绩查询与管理</p>
    </div>

    <div class="flex flex-wrap gap-3">
      <Button variant="outline" @click="showExportDialog = true">导出为 CSV</Button>
      <Button variant="outline" class="text-orange-500" @click="showUnlockAllDialog = true">解锁全曲</Button>
    </div>

    <Card>
      <CardHeader>
        <CardTitle class="flex items-center justify-between gap-4">
          <span>中二节奏成绩表格</span>
          <Input
            v-model="searchQuery"
            placeholder="查找乐曲"
            class="w-[220px]"
          />
        </CardTitle>
        <CardDescription>
          Rating: {{ b30Rating.toFixed(4) }} + {{ n20Rating.toFixed(4) }} = {{ totalRating.toFixed(4) }}
          <span v-if="isFilterActive" class="ml-3 text-orange-500">
            筛选乐曲: {{ filteredB30Rating.toFixed(4) }} + {{ filteredN20Rating.toFixed(4) }} = {{ (filteredB30Rating + filteredN20Rating).toFixed(4) }}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FilterSlider ref="filterRef" v-model="filterValue" />

        <Tabs v-model="tab" class="mt-4">
          <TabsList>
            <TabsTrigger value="b30">旧乐谱 B30</TabsTrigger>
            <TabsTrigger value="n20">中二节奏 N20</TabsTrigger>
          </TabsList>
          <TabsContent value="b30">
            <ChuniTable
              :records="b30Display"
              :music-data-dict="chuniStore.musicDataDict"
              :loading="chuniStore.loading"
              :limit="30"
              :search-query="searchQuery"
            />
          </TabsContent>
          <TabsContent value="n20">
            <ChuniTable
              :records="n20Display"
              :music-data-dict="chuniStore.musicDataDict"
              :loading="chuniStore.loading"
              :limit="20"
              :search-query="searchQuery"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>

    <ExportDialog v-model:open="showExportDialog" :records="chuniStore.records" />
    <UnlockAllDialog v-model:open="showUnlockAllDialog" @confirm="handleUnlockAll" />
  </div>
</template>
