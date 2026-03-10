<script setup lang="ts">
import { ref } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { exportMaimaiToCSV } from '@/lib/csv'
import type { MaimaiRecord } from '../types'

const props = defineProps<{
  open: boolean
  records: MaimaiRecord[]
}>()

const emit = defineEmits<{
  'update:open': [boolean]
}>()

const encoding = ref<'UTF-8' | 'GBK'>('GBK')

function handleExport() {
  exportMaimaiToCSV(props.records, encoding.value)
  emit('update:open', false)
}

function closeDialog() {
  emit('update:open', false)
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>导出为 CSV</DialogTitle>
      </DialogHeader>
      <div class="space-y-4">
        <div class="flex items-center gap-4">
          <Label for="encoding" class="whitespace-nowrap">选择编码</Label>
          <Select v-model="encoding">
            <SelectTrigger id="encoding" class="w-[120px]">
              <SelectValue placeholder="选择编码" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GBK">GBK</SelectItem>
              <SelectItem value="UTF-8">UTF-8</SelectItem>
            </SelectContent>
          </Select>
          <span class="text-sm text-muted-foreground">
            GBK编码一般用于Excel打开，UTF-8编码则可以供部分其他编辑器直接显示。
          </span>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" @click="closeDialog">取消</Button>
        <Button @click="handleExport">导出乐谱</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
