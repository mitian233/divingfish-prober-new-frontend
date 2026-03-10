<script setup lang="ts">
import { computed, h, shallowRef } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { DataTable } from '@/components/ui/data-table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { MaimaiMusicData, MaimaiRecord } from '../types'

interface PlateRow {
  id: number
  title: string
  bas_pq: number
  adv_pq: number
  exp_pq: number
  mst_pq: number
  rem_pq: number
  levelCount: number
}

const props = defineProps<{
  musicData: MaimaiMusicData[]
  records: MaimaiRecord[]
}>()

const open = shallowRef(false)
const masOnly = shallowRef(true)
const version = shallowRef<string>('')

const FINALE_VERSIONS = [
  'maimai',
  'maimai PLUS',
  'maimai GreeN',
  'maimai GreeN PLUS',
  'maimai ORANGE',
  'maimai ORANGE PLUS',
  'maimai PiNK',
  'maimai PiNK PLUS',
  'maimai MURASAKi',
  'maimai MURASAKi PLUS',
  'maimai MiLK',
  'MiLK PLUS',
  'maimai FiNALE',
]

const versions = computed(() => {
  const list = Array.from(
    new Set(props.musicData.map((item) => item.basic_info.from).filter(Boolean))
  ) as string[]
  return [...list, 'ALL FiNALE']
})

if (!version.value) {
  version.value = versions.value[0] || 'ALL FiNALE'
}

function recordsFilter(songId: number, diff: number): MaimaiRecord | null {
  return props.records.find((record) => record.song_id === songId && record.level_index === diff) || null
}

function sumPq(songId: number, diff: number): number {
  const record = recordsFilter(songId, diff)
  if (!record) return 0
  let value = 0
  if (['fc', 'fcp', 'ap', 'app'].includes(record.fc)) value += 1
  if (record.achievements >= 100) value += 2
  if (['fsd', 'fsdp'].includes(record.fs)) value += 4
  if (['ap', 'app'].includes(record.fc)) value += 8
  return value
}

function filterByVersion(versionName: string): MaimaiMusicData[] {
  if (versionName === 'ALL FiNALE') {
    return props.musicData.filter((item) => FINALE_VERSIONS.includes(item.basic_info.from || ''))
  }
  return props.musicData.filter((item) => item.basic_info.from === versionName)
}

const tableData = computed<PlateRow[]>(() => {
  const current = filterByVersion(version.value)
  return current.map((music) => {
    const rem = music.level.length >= 5 ? sumPq(music.id, 4) : -1
    return {
      id: music.id,
      title: music.title,
      bas_pq: sumPq(music.id, 0),
      adv_pq: sumPq(music.id, 1),
      exp_pq: sumPq(music.id, 2),
      mst_pq: sumPq(music.id, 3),
      rem_pq: rem,
      levelCount: music.level.length,
    }
  })
})

const filteredLength = computed(() => {
  const base = tableData.value.reduce((sum, row) => {
    if (masOnly.value) {
      return sum + 1 + (version.value === 'ALL FiNALE' && row.rem_pq !== -1 ? 1 : 0)
    }
    return sum + 4 + (version.value === 'ALL FiNALE' && row.rem_pq !== -1 ? 1 : 0)
  }, 0)
  return base
})

function totalByBit(bit: number): number {
  return tableData.value.reduce((sum, row) => {
    let acc = 0
    if (row.mst_pq & bit) acc++
    if (!masOnly.value) {
      if (row.bas_pq & bit) acc++
      if (row.adv_pq & bit) acc++
      if (row.exp_pq & bit) acc++
    }
    if (version.value === 'ALL FiNALE' && row.rem_pq !== -1 && row.rem_pq & bit) acc++
    return sum + acc
  }, 0)
}

function renderPq(value: number) {
  if (value === -1) {
    return h('span', { class: 'text-muted-foreground' }, '-')
  }
  const nodes: any[] = []
  if (value & 1) nodes.push(h('span', { class: 'text-green-600 text-sm' }, '✓'))
  if (value & 2) nodes.push(h('span', { class: 'text-blue-600 text-sm' }, '✓'))
  if (value & 4) nodes.push(h('span', { class: 'text-purple-600 text-sm' }, '✓'))
  if (value & 8) nodes.push(h('span', { class: 'text-orange-500 text-sm' }, '✓'))
  return h('div', { class: 'flex items-center gap-1' }, nodes.length ? nodes : [h('span', { class: 'text-muted-foreground' }, '—')])
}

const columns = computed<ColumnDef<PlateRow>[]>(() => {
  const cols: ColumnDef<PlateRow>[] = [
    { id: 'title', accessorKey: 'title', header: '曲名' },
  ]
  if (!masOnly.value) {
    cols.push(
      { id: 'bas_pq', accessorKey: 'bas_pq', header: 'Basic', cell: ({ row }) => renderPq(row.original.bas_pq) },
      { id: 'adv_pq', accessorKey: 'adv_pq', header: 'Advanced', cell: ({ row }) => renderPq(row.original.adv_pq) },
      { id: 'exp_pq', accessorKey: 'exp_pq', header: 'Expert', cell: ({ row }) => renderPq(row.original.exp_pq) }
    )
  }
  cols.push({
    id: 'mst_pq',
    accessorKey: 'mst_pq',
    header: 'Master',
    cell: ({ row }) => renderPq(row.original.mst_pq),
  })
  if (version.value === 'ALL FiNALE') {
    cols.push({
      id: 'rem_pq',
      accessorKey: 'rem_pq',
      header: 'Re:MASTER',
      cell: ({ row }) => renderPq(row.original.rem_pq),
    })
  }
  return cols
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button variant="outline">牌子查询</Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[1100px] max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>极将神牌辅助查询工具</DialogTitle>
      </DialogHeader>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <Label>选择版本</Label>
          <Select v-model="version">
            <SelectTrigger>
              <SelectValue placeholder="选择版本" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="item in versions" :key="item" :value="item">{{ item }}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="flex items-center gap-3 pt-6">
          <Checkbox id="mas-only" v-model:checked="masOnly" />
          <Label for="mas-only">仅查看 Master</Label>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2 text-sm">
        <Badge class="bg-green-600 text-white">✓ FC</Badge>
        <Badge class="bg-blue-600 text-white">✓ SSS</Badge>
        <Badge class="bg-purple-600 text-white">✓ FSDX</Badge>
        <Badge class="bg-orange-500 text-white">✓ AP</Badge>
      </div>

      <div class="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <span class="text-green-600">✓ {{ totalByBit(1) }}/{{ filteredLength }}</span>
        <span class="text-blue-600">✓ {{ totalByBit(2) }}/{{ filteredLength }}</span>
        <span class="text-purple-600">✓ {{ totalByBit(4) }}/{{ filteredLength }}</span>
        <span class="text-orange-500">✓ {{ totalByBit(8) }}/{{ filteredLength }}</span>
      </div>

      <DataTable
        :columns="columns"
        :data="tableData"
        :page-size="50"
        :show-search="true"
        :show-column-toggle="false"
        :show-pagination="true"
        :search-placeholder="'搜索曲名...'"
      />
    </DialogContent>
  </Dialog>
</template>
