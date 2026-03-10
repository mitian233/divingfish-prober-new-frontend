<script setup lang="ts">
import { computed, h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/ui/data-table'
import type { ChuniMusicData, ChuniRecord } from '../types'

const props = defineProps<{
  records: ChuniRecord[]
  musicDataDict: Record<number, ChuniMusicData>
  limit: number
  loading: boolean
  searchQuery: string
}>()

const LEVEL_COLORS: Record<number, string> = {
  0: 'bg-green-500',
  1: 'bg-yellow-500',
  2: 'bg-red-500',
  3: 'bg-purple-500',
  4: 'bg-slate-500',
  5: 'bg-cyan-500',
}

const FC_NAMES: Record<string, string> = {
  fullcombo: 'FC',
  fullchain: 'FULL CHAIN',
  alljustice: 'AJ',
}

function getLevelColor(levelIndex: number): string {
  return LEVEL_COLORS[levelIndex] || 'bg-gray-500'
}

function getFcColor(fc: string): string {
  if (!fc) return ''
  if (fc.startsWith('fullcombo')) return 'bg-green-600'
  return 'bg-orange-600'
}

function getFcName(fc: string): string {
  return FC_NAMES[fc] || fc.toUpperCase()
}

function getScoreRate(score: number): string {
  if (score < 500000) return 'D'
  if (score < 600000) return 'C'
  if (score < 700000) return 'B'
  if (score < 800000) return 'BB'
  if (score < 900000) return 'BBB'
  if (score < 925000) return 'A'
  if (score < 950000) return 'AA'
  if (score < 975000) return 'AAA'
  if (score < 990000) return 'S'
  if (score < 1000000) return 'S+'
  if (score < 1005000) return 'SS'
  if (score < 1007500) return 'SS+'
  if (score < 1009000) return 'SSS'
  return 'SSS+'
}

function getRateColor(rate: string): string {
  if (rate.startsWith('SSS')) return 'bg-red-500'
  if (rate.startsWith('SS')) return 'bg-blue-600'
  if (rate.startsWith('S')) return 'bg-amber-600'
  return ''
}

const columns: ColumnDef<ChuniRecord>[] = [
  {
    id: 'rank',
    accessorKey: 'rank',
    header: '排名',
    size: 60,
  },
  {
    id: 'title',
    accessorKey: 'title',
    header: '乐曲名',
    cell: ({ row }) => {
      const record = row.original
      const music = props.musicDataDict[record.mid]

      return h('div', { class: 'flex flex-col gap-1' }, [
        h('div', { class: 'flex items-center gap-2' }, [
          h('span', {}, record.title),
          record.fc ? h(Badge, { class: `${getFcColor(record.fc)} text-white text-xs` }, () => getFcName(record.fc)) : null,
        ]),
        music
          ? h(
              'span',
              { class: 'text-xs text-muted-foreground' },
              `ID ${music.id} · ${music.basic_info.from}`
            )
          : null,
      ])
    },
  },
  {
    id: 'level',
    accessorKey: 'level',
    header: '难度',
    size: 120,
    cell: ({ row }) =>
      h(
        Badge,
        { class: `${getLevelColor(row.original.level_index)} text-white` },
        () => `${row.original.level_label} ${row.original.level}`
      ),
  },
  {
    id: 'ds',
    accessorKey: 'ds',
    header: '定数',
    size: 80,
    cell: ({ row }) => row.original.ds.toFixed(1),
  },
  {
    id: 'score',
    accessorKey: 'score',
    header: '分数',
    size: 140,
    cell: ({ row }) => {
      const rate = getScoreRate(row.original.score)
      const color = getRateColor(rate)
      return h('div', { class: 'flex items-center gap-2' }, [
        h('span', {}, row.original.score.toString()),
        color ? h(Badge, { class: `${color} text-white text-xs` }, () => rate) : null,
      ])
    },
  },
  {
    id: 'ra',
    accessorKey: 'ra',
    header: 'Rating',
    size: 100,
    cell: ({ row }) =>
      h(
        'span',
        { class: row.original.rank <= props.limit ? 'text-green-600 font-medium' : '' },
        row.original.ra.toFixed(2)
      ),
  },
]

const filteredRecords = computed(() => {
  if (!props.searchQuery) return props.records

  const query = props.searchQuery.toLowerCase()
  return props.records.filter((record) => {
    const music = props.musicDataDict[record.mid]
    const searchIndex = [
      record.title,
      String(record.mid),
      String(record.cid),
      String(record.ds),
      String(record.score),
      String(record.ra),
      music?.basic_info?.from ?? '',
      music?.basic_info?.artist ?? '',
      String(music?.basic_info?.bpm ?? ''),
    ].map((value) => value.toLowerCase())

    return searchIndex.some((value) => value.includes(query))
  })
})
</script>

<template>
  <div class="space-y-3">
    <p v-if="loading" class="text-sm text-muted-foreground">加载中...</p>
    <DataTable
      :columns="columns"
      :data="filteredRecords"
      :page-size="limit"
      :show-search="false"
      :show-column-toggle="true"
      :show-pagination="true"
    />
  </div>
</template>
