<script setup lang="ts">
import { computed, ref } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { ChuniMusicData, ChuniRecord } from '../types'

type EmptyToken = '__empty__'
type ChuniRate = 'd' | 'c' | 'b' | 'bb' | 'bbb' | 'a' | 'aa' | 'aaa' | 's' | 'sp' | 'ss' | 'ssp' | 'sss' | 'sssp'

const props = defineProps<{
  musicData: ChuniMusicData[]
  musicDataDict: Record<number, ChuniMusicData>
}>()

const FC_ITEMS: Array<{ label: string; value: string | EmptyToken }> = [
  { label: '空', value: '__empty__' },
  { label: 'FC', value: 'fullcombo' },
  { label: 'FULL CHAIN', value: 'fullchain' },
  { label: 'AJ', value: 'alljustice' },
]

const LEVEL_ITEMS = [
  { label: 'Basic', value: 0 },
  { label: 'Advanced', value: 1 },
  { label: 'Expert', value: 2 },
  { label: 'Master', value: 3 },
  { label: 'Ultima', value: 4 },
  { label: "World's End", value: 5 },
]

const RATE_ITEMS: Array<{ label: string; value: ChuniRate }> = [
  { label: 'SSS+', value: 'sssp' },
  { label: 'SSS', value: 'sss' },
  { label: 'SS+', value: 'ssp' },
  { label: 'SS', value: 'ss' },
  { label: 'S+', value: 'sp' },
  { label: 'S', value: 's' },
  { label: 'AAA', value: 'aaa' },
  { label: 'AA', value: 'aa' },
  { label: 'A', value: 'a' },
  { label: 'BBB', value: 'bbb' },
  { label: 'BB', value: 'bb' },
  { label: 'B', value: 'b' },
  { label: 'C', value: 'c' },
  { label: 'D', value: 'd' },
]

const selectedFc = ref<Array<string | EmptyToken>>([])
const selectedLevel = ref<number[]>([])
const selectedRate = ref<ChuniRate[]>([])
const version = ref<string | undefined>(undefined)
const genre = ref<string | undefined>(undefined)

function getRateByScore(score: number): ChuniRate {
  if (score < 500000) return 'd'
  if (score < 600000) return 'c'
  if (score < 700000) return 'b'
  if (score < 800000) return 'bb'
  if (score < 900000) return 'bbb'
  if (score < 925000) return 'a'
  if (score < 950000) return 'aa'
  if (score < 975000) return 'aaa'
  if (score < 990000) return 's'
  if (score < 1000000) return 'sp'
  if (score < 1005000) return 'ss'
  if (score < 1007500) return 'ssp'
  if (score < 1009000) return 'sss'
  return 'sssp'
}

const versions = computed(() =>
  Array.from(new Set(props.musicData.map((item) => item.basic_info.from).filter(Boolean))) as string[]
)

const genres = computed(() =>
  Array.from(new Set(props.musicData.map((item) => item.basic_info.genre).filter(Boolean))) as string[]
)

function toggleItem<T>(target: T[], value: T) {
  const idx = target.findIndex((item) => item === value)
  if (idx >= 0) {
    target.splice(idx, 1)
  } else {
    target.push(value)
  }
}

function normalizeField(value: string): string | EmptyToken {
  return value ? value : '__empty__'
}

function selectAll() {
  selectedFc.value = FC_ITEMS.map((item) => item.value)
  selectedLevel.value = LEVEL_ITEMS.map((item) => item.value)
  selectedRate.value = RATE_ITEMS.map((item) => item.value)
}

function reset() {
  selectAll()
  version.value = undefined
  genre.value = undefined
}

function filter(record: ChuniRecord): boolean {
  if (!selectedFc.value.includes(normalizeField(record.fc))) return false
  if (!selectedLevel.value.includes(record.level_index)) return false
  if (!selectedRate.value.includes(getRateByScore(record.score))) return false

  const music = props.musicDataDict[record.mid]
  if (version.value && music?.basic_info.from !== version.value) return false
  if (genre.value && music?.basic_info.genre !== genre.value) return false
  return true
}

function badgeVariant(active: boolean): 'default' | 'outline' {
  return active ? 'default' : 'outline'
}

reset()

defineExpose({
  filter,
  reset,
})
</script>

<template>
  <div class="rounded-lg border p-4 space-y-4">
    <div class="flex items-center justify-between">
      <p class="text-sm font-medium">中二高级筛选</p>
      <Button size="sm" variant="outline" @click="reset">重置</Button>
    </div>

    <div class="space-y-2">
      <Label class="text-xs text-muted-foreground">连击筛选</Label>
      <div class="flex flex-wrap gap-2">
        <Badge
          v-for="item in FC_ITEMS"
          :key="item.value"
          class="cursor-pointer"
          :variant="badgeVariant(selectedFc.includes(item.value))"
          @click="toggleItem(selectedFc, item.value)"
        >
          {{ item.label }}
        </Badge>
      </div>
    </div>

    <div class="space-y-2">
      <Label class="text-xs text-muted-foreground">难度筛选</Label>
      <div class="flex flex-wrap gap-2">
        <Badge
          v-for="item in LEVEL_ITEMS"
          :key="item.value"
          class="cursor-pointer"
          :variant="badgeVariant(selectedLevel.includes(item.value))"
          @click="toggleItem(selectedLevel, item.value)"
        >
          {{ item.label }}
        </Badge>
      </div>
    </div>

    <div class="space-y-2">
      <Label class="text-xs text-muted-foreground">评级筛选</Label>
      <div class="flex flex-wrap gap-2">
        <Badge
          v-for="item in RATE_ITEMS"
          :key="item.value"
          class="cursor-pointer"
          :variant="badgeVariant(selectedRate.includes(item.value))"
          @click="toggleItem(selectedRate, item.value)"
        >
          {{ item.label }}
        </Badge>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div class="space-y-2">
        <Label>版本</Label>
        <Select v-model="version">
          <SelectTrigger>
            <SelectValue placeholder="全部版本" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="item in versions" :key="item" :value="item">{{ item }}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="space-y-2">
        <Label>歌曲类别</Label>
        <Select v-model="genre">
          <SelectTrigger>
            <SelectValue placeholder="全部类别" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="item in genres" :key="item" :value="item">{{ item }}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
</template>
