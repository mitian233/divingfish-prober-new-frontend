<script setup lang="ts">
import { computed, h, nextTick, onUnmounted, shallowRef, useTemplateRef, watch } from 'vue'
import type { MaimaiRecord, MaimaiMusicData, MaimaiChartStats } from '../types'
import { getCoverPathById } from '../domain/recordCalculator'
import ScoreCoefficient from '../domain/scoreCoefficient'
import type { ColumnDef } from '@tanstack/vue-table'
import type { ECharts, EChartsOption } from 'echarts'
import { DataTable } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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

function getRateColor(rate: string): string {
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

function formatRate(rate: string): string {
  return rate.replace('p', '+').toUpperCase()
}

function getActualLevelIndex(record: MaimaiRecord): number {
  if (record.song_id > 100000) return 0
  return record.level_index
}

function getMusicInfo(record: MaimaiRecord): MaimaiMusicData | null {
  return props.musicDataDict[record.song_id] || null
}

function getChartStat(record: MaimaiRecord) {
  return props.chartStats.charts[record.song_id]?.[getActualLevelIndex(record)]
}

function getDiffStat(record: MaimaiRecord) {
  return props.chartStats.diff_data?.[record.level]
}

function canShowStatsChart(record: MaimaiRecord): boolean {
  const stat = getChartStat(record)
  const diff = getDiffStat(record)
  return Boolean(stat?.dist && stat.fc_dist && stat.cnt && diff?.dist && diff.fc_dist)
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
  if (record.block) return
  emit('edit', record)
}

function handleCover(record: MaimaiRecord) {
  emit('cover', record)
}

function handleCalculator(record: MaimaiRecord) {
  emit('calculator', record)
}

const showStatsDialog = shallowRef(false)
const statsRecord = shallowRef<MaimaiRecord | null>(null)
const statsChartEl = useTemplateRef<HTMLDivElement>('statsChart')
const statsChart = shallowRef<ECharts | null>(null)
const echartsLib = shallowRef<typeof import('echarts') | null>(null)

function openStatsChart(record: MaimaiRecord) {
  if (!canShowStatsChart(record)) return
  statsRecord.value = record
  showStatsDialog.value = true
}

function sumArr(arr: number[], start: number, end: number) {
  let sum = 0
  for (let i = start; i < end; i++) {
    sum += arr[i] || 0
  }
  return sum
}

async function renderStatsChart() {
  const record = statsRecord.value
  const chartEl = statsChartEl.value
  if (!record || !chartEl) return
  if (!echartsLib.value) {
    echartsLib.value = await import('echarts')
  }

  const chartStat = getChartStat(record)
  const diffStat = getDiffStat(record)
  if (!chartStat?.dist || !chartStat.fc_dist || !chartStat.cnt || !diffStat?.dist || !diffStat.fc_dist) return

  const achNameMap = ['D', 'C', 'B', 'BB', 'BBB', 'A', 'AA', 'AAA', 'S', 'S+', 'SS', 'SS+', 'SSS', 'SSS+']
  const fcNameMap = ['Not FC', 'FC', 'FC+', 'AP', 'AP+']
  const achColors = ['#B0BEC5', '#90A4AE', '#607D8B', '#546E7A', '#455A64', '#FF8A65', '#FF5722', '#E64A19', '#FFD54F', '#FFA000', '#4DB6AC', '#00796B', '#64B5F6', '#1976D2']
  const fcColors = ['#607D8B', '#4CAF50', '#43A047', '#FF9800', '#FB8C00']

  const achData = achNameMap.map((name, idx) => ({
    name,
    value: (chartStat.dist?.[idx] || 0) / chartStat.cnt!,
  }))

  const fcData = fcNameMap.map((name, idx) => ({
    name,
    value: (chartStat.fc_dist?.[idx] || 0) / chartStat.cnt!,
  }))

  const option: EChartsOption = {
    title: {
      text: `${record.title} ${record.type} ${record.level_label}`,
      left: 'center',
      textStyle: { fontSize: 14 },
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const { seriesName, dataIndex, value, name } = params
        if (seriesName === '达成率等级') {
          const diff = ((value - (diffStat.dist?.[dataIndex] || 0)) * 100).toFixed(2)
          const sumPer = ((sumArr(chartStat.dist || [], dataIndex, 14) / chartStat.cnt!) * 100).toFixed(2)
          const avgSum = (sumArr(diffStat.dist || [], dataIndex, 14) * 100).toFixed(2)
          return `${name}: ${(value * 100).toFixed(2)}% / 合计 ${sumPer}%<br/>同难度平均: ${((diffStat.dist?.[dataIndex] || 0) * 100).toFixed(2)}% / 合计 ${avgSum}%<br/>Diff: ${diff}%`
        }
        const diff = ((value - (diffStat.fc_dist?.[dataIndex] || 0)) * 100).toFixed(2)
        const sumPer = ((sumArr(chartStat.fc_dist || [], dataIndex, 5) / chartStat.cnt!) * 100).toFixed(2)
        const avgSum = (sumArr(diffStat.fc_dist || [], dataIndex, 5) * 100).toFixed(2)
        return `${name}: ${(value * 100).toFixed(2)}% / 合计 ${sumPer}%<br/>同难度平均: ${((diffStat.fc_dist?.[dataIndex] || 0) * 100).toFixed(2)}% / 合计 ${avgSum}%<br/>Diff: ${diff}%`
      },
    },
    legend: {
      orient: 'horizontal',
      bottom: 0,
    },
    series: [
      {
        name: '达成率等级',
        type: 'pie',
        radius: '42%',
        top: 0,
        data: achData,
        itemStyle: {
          color: (params: any) => achColors[params.dataIndex] || '#9E9E9E',
        },
      },
      {
        name: '全连等级',
        type: 'pie',
        radius: ['42%', '53%'],
        top: 0,
        data: fcData,
        itemStyle: {
          color: (params: any) => fcColors[params.dataIndex] || '#9E9E9E',
        },
      },
    ],
  }

  if (!statsChart.value) {
    statsChart.value = echartsLib.value.init(chartEl)
  }
  statsChart.value.setOption(option)
  statsChart.value.resize()
}

const statsSummary = computed(() => {
  const record = statsRecord.value
  if (!record) return null
  const chartStat = getChartStat(record)
  const diffStat = getDiffStat(record)
  if (!chartStat || !diffStat || chartStat.avg === undefined || chartStat.avg_dx === undefined || chartStat.std_dev === undefined) {
    return null
  }
  return {
    avg: chartStat.avg,
    avgDx: chartStat.avg_dx,
    stdDev: chartStat.std_dev,
    diff: chartStat.avg - record.achievements,
  }
})

watch([showStatsDialog, statsRecord], async ([open]) => {
  if (!open) return
  await nextTick()
  await renderStatsChart()
})

watch(statsChartEl, async () => {
  if (showStatsDialog.value) {
    await renderStatsChart()
  }
})

onUnmounted(() => {
  if (statsChart.value) {
    statsChart.value.dispose()
    statsChart.value = null
  }
})

const columns: ColumnDef<MaimaiRecord>[] = [
  {
    id: 'rank',
    accessorKey: 'rank',
    header: '排名',
    size: 60,
  },
  {
    id: 'cover',
    header: '封面',
    size: 80,
    cell: ({ row }) => {
      return h('img', {
        src: `/covers/${getCoverPathById(row.original.song_id)}`,
        alt: row.original.title,
        class: 'w-[72px] h-[72px] object-cover rounded cursor-pointer hover:opacity-80 transition-opacity',
        onClick: () => handleCover(row.original),
      })
    },
  },
  {
    id: 'title',
    accessorKey: 'title',
    header: '乐曲名',
    cell: ({ row }) => {
      const record = row.original
      const fc = getFcBadge(record.fc)
      const fs = getFsBadge(record.fs)
      
      const children: any[] = []
      if (record.type === 'DX') {
        children.push(h('span', { class: 'text-blue-500 font-medium' }, 'DX '))
      }
      children.push(h('span', {}, record.title))
      
      const badges: any[] = []
      if (fc) {
        badges.push(h(Badge, { class: `${fc.color} text-white text-xs` }, () => fc.name))
      }
      if (fs) {
        badges.push(h(Badge, { class: `${fs.color} text-white text-xs ml-1` }, () => fs.name))
      }
      
      return h('div', { class: 'flex flex-col gap-1' }, [
        h('div', { class: 'flex items-center gap-2' }, children),
        badges.length > 0 ? h('div', { class: 'flex gap-1' }, badges) : null,
      ])
    },
  },
  {
    id: 'level',
    accessorKey: 'level',
    header: '难度',
    size: 100,
    cell: ({ row }) => {
      const record = row.original
      return h(
        Badge,
        { class: `${getLevelColor(record.level_index)} text-white` },
        () => `${record.level_label} ${record.level}${record.song_id > 100000 ? '?' : ''}`
      )
    },
  },
  {
    id: 'ds',
    accessorKey: 'ds',
    header: '定数',
    size: 60,
    cell: ({ row }) => row.original.ds.toFixed(1),
  },
  {
    id: 'achievements',
    accessorKey: 'achievements',
    header: '达成率',
    size: 120,
    cell: ({ row }) => {
      const record = row.original
      const rateColor = getRateColor(record.rate)
      
      const children: any[] = [
        h('span', `${record.achievements.toFixed(4)}%`),
      ]
      
      if (rateColor) {
        children.push(
          h(Badge, { class: `${rateColor} text-white text-xs ml-1` }, () => formatRate(record.rate))
        )
      }
      
      return h('div', { class: 'flex items-center gap-2' }, children)
    },
  },
  {
    id: 'ra',
    accessorKey: 'ra',
    header: 'DX Rating',
    size: 80,
    cell: ({ row }) => {
      const record = row.original
      const moreRa = getMoreRa(record)
      const inTop = isInTopLimit(record)
      
      const raText = h(
        'span',
        { class: inTop ? 'text-green-500 font-medium cursor-pointer' : 'cursor-pointer' },
        record.ra
      )
      
      if (moreRa.length > 0) {
        const tooltipContent = h('div', { class: 'text-xs space-y-1' }, [
          ...moreRa.map((item) =>
            h('div', {}, `${item.ra}(+${item.ra - record.ra}): ${item.achievements.toFixed(4)}%`)
          ),
        ])
        
        return h(TooltipProvider, {}, () => [
          h(Tooltip, {}, {
            default: () => [
              h(TooltipTrigger, { asChild: true }, () => raText),
              h(TooltipContent, {}, () => tooltipContent),
            ],
          }),
        ])
      }
      
      return raText
    },
  },
  {
    id: 'fit_diff',
    accessorKey: 'fit_diff',
    header: '拟合难度',
    size: 80,
    cell: ({ row }) => {
      const record = row.original
      const hasStats = getChartStat(record)
      const canShow = canShowStatsChart(record)
      
      return h(
        'span',
        {
          class: hasStats ? (canShow ? 'cursor-pointer hover:underline' : 'cursor-default') : 'cursor-default text-red-500',
          onClick: () => openStatsChart(record),
        },
        hasStats ? record.fit_diff.toFixed(2) : record.ds.toFixed(2)
      )
    },
  },
  {
    id: 'actions',
    header: '操作',
    size: 100,
    cell: ({ row }) => {
      const record = row.original
      
      return h('div', { class: 'flex gap-1' }, [
        h(TooltipProvider, {}, () => [
          h(Tooltip, {}, {
            default: () => [
              h(TooltipTrigger, { asChild: true }, () =>
                h(Button, {
                  variant: 'ghost',
                  size: 'icon',
                  onClick: () => handleCover(record),
                }, () => '📷')
              ),
              h(TooltipContent, {}, () => '查看封面'),
            ],
          }),
        ]),
        h(TooltipProvider, {}, () => [
          h(Tooltip, {}, {
            default: () => [
              h(TooltipTrigger, { asChild: true }, () =>
                h(Button, {
                  variant: 'ghost',
                  size: 'icon',
                  disabled: record.block,
                  onClick: () => handleEdit(record),
                }, () => '✏️')
              ),
              h(TooltipContent, {}, () => '编辑分数'),
            ],
          }),
        ]),
        h(TooltipProvider, {}, () => [
          h(Tooltip, {}, {
            default: () => [
              h(TooltipTrigger, { asChild: true }, () =>
                h(Button, {
                  variant: 'ghost',
                  size: 'icon',
                  onClick: () => handleCalculator(record),
                }, () => '🧮')
              ),
              h(TooltipContent, {}, () => '填入计算器'),
            ],
          }),
        ]),
      ])
    },
  },
]

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
  <div class="space-y-2">
    <DataTable
      :columns="columns"
      :data="filteredRecords"
      :page-size="limit"
      :search-placeholder="'搜索曲名、ID、谱师...'"
      :show-search="false"
      :show-column-toggle="true"
      :show-pagination="true"
    />

    <Dialog :open="showStatsDialog" @update:open="showStatsDialog = $event">
      <DialogContent class="sm:max-w-[760px]">
        <DialogHeader>
          <DialogTitle>谱面统计信息</DialogTitle>
        </DialogHeader>
        <div ref="statsChart" class="h-[420px] w-full" />
        <div v-if="statsSummary" class="grid grid-cols-1 gap-1 text-sm text-muted-foreground">
          <p>
            平均达成率：
            <span class="font-medium text-foreground">{{ statsSummary.avg.toFixed(2) }}%</span>
            （与当前差值
            <span :class="statsSummary.diff >= 0 ? 'text-green-600' : 'text-red-600'">
              {{ statsSummary.diff >= 0 ? '+' : '' }}{{ statsSummary.diff.toFixed(2) }}%
            </span>
            ）
          </p>
          <p>平均 DX 分数：<span class="font-medium text-foreground">{{ statsSummary.avgDx.toFixed(1) }}</span></p>
          <p>谱面成绩标准差：<span class="font-medium text-foreground">{{ statsSummary.stdDev.toFixed(2) }}</span></p>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
