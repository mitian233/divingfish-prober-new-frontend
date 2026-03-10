<script setup lang="ts">
import { computed } from 'vue'
import type { MaimaiRecord, MaimaiMusicData, MaimaiChartStats, MaimaiRate } from '../types'
import { getCoverPathById } from '../domain/recordCalculator'
import ScoreCoefficient from '../domain/scoreCoefficient'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const props = defineProps<{
  records: MaimaiRecord[]
  musicDataDict: Record<number, MaimaiMusicData>
  chartStats: MaimaiChartStats
  chartCombo: Record<number, number[]>
  loading: boolean
  limit: number
  searchQuery: string
}>()

const emit = defineEmits<{
  'edit': [MaimaiRecord]
  'cover': [MaimaiRecord]
  'calculator': [MaimaiRecord]
}>()

const LEVEL_COLORS: Record<number, string> = {
  0: 'bg-green-500',
  1: 'bg-yellow-500',
  2: 'bg-red-500',
  3: 'bg-purple-500',
  4: 'bg-pink-400',
  5: 'bg-fuchsia-500',
}

const FC_COLORS: Record<string, string> = {
  fc: 'bg-green-500',
  fcp: 'bg-green-600',
  ap: 'bg-orange-500',
  app: 'bg-orange-600',
}

const FS_COLORS: Record<string, string> = {
  fs: 'bg-blue-500',
  fsp: 'bg-blue-600',
  fsd: 'bg-orange-500',
  fsdp: 'bg-orange-600',
}

const FC_NAMES: Record<string, string> = {
  fc: 'FC',
  fcp: 'FC+',
  ap: 'AP',
  app: 'AP+',
}

const FS_NAMES: Record<string, string> = {
  fs: 'FS',
  fsp: 'FS+',
  fsd: 'FSDX',
  fsdp: 'FSDX+',
}

function getLevelColor(levelIndex: number): string {
  return LEVEL_COLORS[levelIndex] || 'bg-gray-500'
}

function getRateColor(rate: MaimaiRate): string {
  if (rate.startsWith('sssp')) return 'bg-red-500'
  if (rate.startsWith('sss')) return 'bg-blue-600'
  if (rate.startsWith('ssp')) return 'bg-amber-600'
  return ''
}

function getFcBadge(fc: string): { color: string; name: string } | null {
  if (!fc) return null
  const color = FC_COLORS[fc] || (fc.startsWith('fc') ? 'bg-green-500' : 'bg-orange-500')
  const name = FC_NAMES[fc] || fc.toUpperCase()
  return { color, name }
}

function getFsBadge(fs: string): { color: string; name: string } | null {
  if (!fs) return null
  const color = FS_COLORS[fs] || (fs.startsWith('fsd') ? 'bg-orange-500' : 'bg-blue-500')
  const name = FS_NAMES[fs] || fs.toUpperCase()
  return { color, name }
}

function formatRate(rate: MaimaiRate): string {
  return rate.replace('p', '+').toUpperCase()
}

function getActualLevelIndex(record: MaimaiRecord): number {
  if (record.song_id > 100000) return 0
  return record.level_index
}

function getMusicInfo(record: MaimaiRecord): MaimaiMusicData | null {
  return props.musicDataDict[record.song_id] || null
}

function getMoreRa(record: MaimaiRecord): { ra: number; achievements: number }[] {
  const coeff = new ScoreCoefficient(record.achievements)
  const moreRa: { ra: number; achievements: number }[] = []
  
  while (moreRa.length < 5 && coeff.getIndex() < coeff.getTableLen() - 1) {
    const res = coeff.getMoreRaLocal(record.ds)
    if (res == null) {
      coeff.setIdx(coeff.getIndex() + 1)
      moreRa.push({ ra: coeff.ra(record.ds), achievements: coeff.getAchievements() })
    } else {
      moreRa.push(res)
      coeff.setIdx(coeff.getIndex() + 1)
      coeff.setIdx(coeff.getIndex() - 1)
    }
  }
  
  return moreRa
}

function isInTopLimit(record: MaimaiRecord): boolean {
  return (record.rank ?? 0) <= props.limit
}

function handleEdit(record: MaimaiRecord) {
  if (record.block) {
    return
  }
  emit('edit', record)
}

function handleCover(record: MaimaiRecord) {
  emit('cover', record)
}

function handleCalculator(record: MaimaiRecord) {
  emit('calculator', record)
}

const filteredRecords = computed(() => {
  if (!props.searchQuery) return props.records
  
  const query = props.searchQuery.toLowerCase()
  return props.records.filter((record) => {
    const music = getMusicInfo(record)
    const charter = music?.charts?.[getActualLevelIndex(record)]?.charter || ''
    const searchIndex = [
      record.title,
      String(record.song_id),
      `id${record.song_id}`,
      String(music?.basic_info?.bpm || ''),
      charter,
      String(record.ra),
      String(record.ds),
    ].map(s => s.toLowerCase())
    
    return searchIndex.some(s => s.includes(query))
  })
})
</script>

<template>
  <div class="w-full overflow-auto">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="w-[60px]">排名</TableHead>
          <TableHead class="w-[80px]">封面</TableHead>
          <TableHead>乐曲名</TableHead>
          <TableHead class="w-[100px]">难度</TableHead>
          <TableHead class="w-[60px]">定数</TableHead>
          <TableHead class="w-[120px]">达成率</TableHead>
          <TableHead class="w-[80px]">DX Rating</TableHead>
          <TableHead class="w-[80px]">拟合难度</TableHead>
          <TableHead class="w-[100px]">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="loading">
          <TableCell :colspan="9" class="text-center py-8 text-muted-foreground">
            加载中...
          </TableCell>
        </TableRow>
        <TableRow v-else-if="filteredRecords.length === 0">
          <TableCell :colspan="9" class="text-center py-8 text-muted-foreground">
            没有数据
          </TableCell>
        </TableRow>
        <TableRow v-for="record in filteredRecords" :key="`${record.song_id}-${record.level_index}`">
          <TableCell>{{ record.rank }}</TableCell>
          <TableCell>
            <img
              :src="`/covers/${getCoverPathById(record.song_id)}`"
              :alt="record.title"
              class="w-[72px] h-[72px] object-cover rounded"
            />
          </TableCell>
          <TableCell>
            <div class="flex flex-col gap-1">
              <div class="flex items-center gap-2">
                <span v-if="record.type === 'DX'" class="text-blue-500 font-medium">DX</span>
                <span>{{ record.title }}</span>
              </div>
              <div class="flex gap-1">
                <Badge v-if="record.fc" :class="getFcBadge(record.fc)?.color" class="text-white text-xs">
                  {{ getFcBadge(record.fc)?.name }}
                </Badge>
                <Badge v-if="record.fs" :class="getFsBadge(record.fs)?.color" class="text-white text-xs">
                  {{ getFsBadge(record.fs)?.name }}
                </Badge>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <Badge :class="getLevelColor(record.level_index)" class="text-white">
              {{ record.level_label }} {{ record.level }}{{ record.song_id > 100000 ? '?' : '' }}
            </Badge>
          </TableCell>
          <TableCell>{{ record.ds.toFixed(1) }}</TableCell>
          <TableCell>
            <div class="flex items-center gap-2">
              <span>{{ record.achievements.toFixed(4) }}%</span>
              <Badge v-if="getRateColor(record.rate)" :class="getRateColor(record.rate)" class="text-white text-xs">
                {{ formatRate(record.rate) }}
              </Badge>
            </div>
          </TableCell>
          <TableCell>
            <TooltipProvider v-if="getMoreRa(record).length > 0">
              <Tooltip>
                <TooltipTrigger as-child>
                  <span :class="isInTopLimit(record) ? 'text-green-500 font-medium' : ''">
                    {{ record.ra }}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <div class="text-xs space-y-1">
                    <div v-for="item in getMoreRa(record)" :key="item.achievements">
                      {{ item.ra }}(+{{ item.ra - record.ra }}): {{ item.achievements.toFixed(4) }}%(+{{ (item.achievements - record.achievements).toFixed(4) }})
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span v-else :class="isInTopLimit(record) ? 'text-green-500 font-medium' : ''">
              {{ record.ra }}
            </span>
          </TableCell>
          <TableCell>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger as-child>
                  <span class="cursor-pointer hover:underline">{{ record.fit_diff.toFixed(2) }}</span>
                </TooltipTrigger>
                <TooltipContent>
                  点击以查看该谱面的统计信息
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableCell>
          <TableCell>
            <div class="flex gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger as-child>
                    <Button variant="ghost" size="icon" @click="handleCover(record)">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>查看封面</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger as-child>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      @click="handleEdit(record)"
                      :disabled="record.block"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>编辑分数</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger as-child>
                    <Button variant="ghost" size="icon" @click="handleCalculator(record)">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>填入计算器</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
