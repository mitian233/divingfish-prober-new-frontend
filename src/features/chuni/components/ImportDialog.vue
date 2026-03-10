<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { ChuniMusicData, ChuniRecord } from '../types'
import { parseChuniImportData } from '../domain/import'

const props = defineProps<{
  open: boolean
  musicData: ChuniMusicData[]
}>()

const emit = defineEmits<{
  'update:open': [boolean]
  import: [ChuniRecord[]]
}>()

const textarea = ref('')
const loading = ref(false)

function closeDialog() {
  emit('update:open', false)
}

function handleImport() {
  if (!textarea.value.trim()) {
    toast.error('请粘贴中二导入数据')
    return
  }

  loading.value = true
  try {
    const records = parseChuniImportData(textarea.value, props.musicData)
    if (records.length === 0) {
      toast.error('未能解析到中二记录，请粘贴 JSON 或 CSV 数据')
      return
    }
    emit('import', records)
    emit('update:open', false)
    textarea.value = ''
  } catch (error) {
    console.error(error)
    toast.error('中二导入失败，请确认数据格式正确')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-[640px]">
      <DialogHeader>
        <DialogTitle>导入中二记录</DialogTitle>
      </DialogHeader>
      <div class="space-y-3">
        <p class="text-sm text-muted-foreground">
          支持粘贴 JSON（`records.best`）或 CSV（排名/乐曲名/难度/定数/分数/Rating）。
        </p>
        <Textarea
          v-model="textarea"
          placeholder="请粘贴中二数据"
          :rows="14"
          class="font-mono text-sm"
        />
      </div>
      <DialogFooter>
        <Button variant="outline" @click="closeDialog">取消</Button>
        <Button :disabled="loading" @click="handleImport">
          {{ loading ? '导入中...' : '确定' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
