<script setup lang="ts" generic="TData, TValue">
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  ExpandedState,
} from '@tanstack/vue-table'
import {
  FlexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { ref } from 'vue'
import { valueUpdater } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const props = withDefaults(
  defineProps<{
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    searchPlaceholder?: string
    pageSize?: number
    showPagination?: boolean
    showSearch?: boolean
    showColumnToggle?: boolean
  }>(),
  {
    searchPlaceholder: '搜索...',
    pageSize: 50,
    showPagination: true,
    showSearch: true,
    showColumnToggle: false,
  }
)

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})
const expanded = ref<ExpandedState>({})

const globalFilter = ref('')

const table = useVueTable({
  get data() {
    return props.data
  },
  get columns() {
    return props.columns
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: (updaterOrValue) => valueUpdater(updaterOrValue, rowSelection),
  onExpandedChange: (updaterOrValue) => valueUpdater(updaterOrValue, expanded),
  onGlobalFilterChange: (updaterOrValue) => valueUpdater(updaterOrValue, globalFilter),
  state: {
    get sorting() {
      return sorting.value
    },
    get columnFilters() {
      return columnFilters.value
    },
    get columnVisibility() {
      return columnVisibility.value
    },
    get rowSelection() {
      return rowSelection.value
    },
    get expanded() {
      return expanded.value
    },
    get globalFilter() {
      return globalFilter.value
    },
  },
  initialState: {
    pagination: {
      pageSize: props.pageSize,
    },
  },
})

defineExpose({
  table,
  getSelectedRows: () => table.getSelectedRowModel().rows,
  resetSelection: () => table.resetRowSelection(),
})
</script>

<template>
  <div class="space-y-4">
    <div v-if="showSearch || showColumnToggle" class="flex items-center justify-between gap-2">
      <div v-if="showSearch" class="flex-1 max-w-sm">
        <Input
          v-model="globalFilter"
          :placeholder="searchPlaceholder"
          class="w-full"
        />
      </div>
      <div v-if="showColumnToggle" class="flex items-center gap-2">
        <Select
          :model-value="table.getState().pagination.pageSize.toString()"
          @update:model-value="(v) => table.setPageSize(Number(v))"
        >
          <SelectTrigger class="w-[100px]">
            <SelectValue placeholder="每页条数" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10条</SelectItem>
            <SelectItem value="20">20条</SelectItem>
            <SelectItem value="50">50条</SelectItem>
            <SelectItem value="100">100条</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div class="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <template v-for="row in table.getRowModel().rows" :key="row.id">
              <TableRow :data-state="row.getIsSelected() ? 'selected' : undefined">
                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                  <FlexRender
                    :render="cell.column.columnDef.cell"
                    :props="cell.getContext()"
                  />
                </TableCell>
              </TableRow>
              <TableRow v-if="row.getIsExpanded()">
                <TableCell :colspan="row.getAllCells().length">
                  <slot name="expanded" :row="row" />
                </TableCell>
              </TableRow>
            </template>
          </template>
          <template v-else>
            <TableRow>
              <TableCell :colspan="columns.length" class="h-24 text-center">
                没有数据
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>

    <div v-if="showPagination" class="flex items-center justify-between px-2">
      <div class="flex-1 text-sm text-muted-foreground">
        共 {{ table.getFilteredRowModel().rows.length }} 条记录
        <span v-if="table.getSelectedRowModel().rows.length > 0">
          ，已选择 {{ table.getSelectedRowModel().rows.length }} 条
        </span>
      </div>
      <div class="flex items-center space-x-2">
        <div class="flex items-center space-x-2">
          <p class="text-sm font-medium">每页</p>
          <Select
            :model-value="table.getState().pagination.pageSize.toString()"
            @update:model-value="(v) => table.setPageSize(Number(v))"
          >
            <SelectTrigger class="h-8 w-[70px]">
              <SelectValue :placeholder="String(table.getState().pagination.pageSize)" />
            </SelectTrigger>
            <SelectContent side="top">
              <SelectItem v-for="size in [10, 20, 30, 50, 100]" :key="size" :value="size.toString()">
                {{ size }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="flex w-[100px] items-center justify-center text-sm font-medium">
          第 {{ table.getState().pagination.pageIndex + 1 }} / {{ table.getPageCount() }} 页
        </div>
        <div class="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            :disabled="!table.getCanPreviousPage()"
            @click="table.previousPage()"
          >
            上一页
          </Button>
          <Button
            variant="outline"
            size="sm"
            :disabled="!table.getCanNextPage()"
            @click="table.nextPage()"
          >
            下一页
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
