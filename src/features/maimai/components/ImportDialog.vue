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
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { parsePageData } from '@/features/import/domain/parser'
import type { MaimaiRecord, MaimaiMusicData } from '../types'
import { buildTitle2IdMap } from '../domain/merge'

const props = defineProps<{
  open: boolean
  musicData: MaimaiMusicData[]
}>()

const emit = defineEmits<{
  'update:open': [boolean]
  'import': [MaimaiRecord[]]
}>()

const textarea = ref('')
const loading = ref(false)

function handleImport() {
  if (!textarea.value.trim()) {
    toast.error('请粘贴乐曲数据的源代码')
    return
  }
  
  loading.value = true
  try {
    const title2IdMap = buildTitle2IdMap(props.musicData)
    const records = parsePageData(textarea.value, title2IdMap)
    
    if (records.length === 0) {
      toast.error('未能解析到任何乐曲数据，请确认导入的是【记录】-【乐曲成绩】-【歌曲类别】')
      return
    }
    
    toast.success(`成功导入 ${records.length} 条乐曲数据`)
    emit('import', records)
    emit('update:open', false)
    textarea.value = ''
  } catch (error) {
    console.error(error)
    toast.error('导入页面信息出错，请确认您导入的是【记录】-【乐曲成绩】-【歌曲类别】')
  } finally {
    loading.value = false
  }
}

function closeDialog() {
  emit('update:open', false)
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>导入数据</DialogTitle>
      </DialogHeader>
      <div class="space-y-4">
        <Textarea
          v-model="textarea"
          placeholder="请将乐曲数据的源代码粘贴到这里"
          :rows="15"
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
