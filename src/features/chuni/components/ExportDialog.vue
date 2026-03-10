<script setup lang="ts">
import { ref } from 'vue'
import { exportChuniToCSV } from '@/lib/csv'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { ChuniRecord } from '../types'

const props = defineProps<{
  open: boolean
  records: ChuniRecord[]
}>()

const emit = defineEmits<{
  'update:open': [boolean]
}>()

const encoding = ref<'UTF-8' | 'GBK'>('GBK')

function closeDialog() {
  emit('update:open', false)
}

function handleExport() {
  exportChuniToCSV(props.records, encoding.value)
  closeDialog()
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>导出中二 CSV</DialogTitle>
      </DialogHeader>
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
          Excel 建议 GBK，其他编辑器建议 UTF-8。
        </span>
      </div>
      <DialogFooter>
        <Button variant="outline" @click="closeDialog">取消</Button>
        <Button @click="handleExport">导出</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
