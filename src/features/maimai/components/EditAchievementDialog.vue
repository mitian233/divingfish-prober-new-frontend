<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import type { MaimaiRecord } from '../types'

const props = defineProps<{
  open: boolean
  record: MaimaiRecord | null
}>()

const emit = defineEmits<{
  'update:open': [boolean]
  'save': [MaimaiRecord]
}>()

const achievements = ref(0)

watch(() => props.record, (newRecord) => {
  if (newRecord) {
    achievements.value = newRecord.achievements
  }
})

const isValid = computed(() => {
  const val = achievements.value
  return isFinite(val) && val >= 0 && val <= 101
})

function handleSave() {
  if (!isValid.value || !props.record) {
    toast.error('请输入合法达成率')
    return
  }
  
  const updatedRecord = {
    ...props.record,
    achievements: parseFloat(achievements.value.toFixed(4))
  }
  emit('save', updatedRecord)
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
        <DialogTitle>修改完成率</DialogTitle>
        <p v-if="record" class="text-sm text-muted-foreground">
          修改
          <i>{{ record.type === 'DX' ? '[DX] ' : '' }}<b>{{ record.title }}</b> [{{ record.level_label }}]</i>
          的完成率为
        </p>
      </DialogHeader>
      <div class="space-y-4">
        <Input
          v-model.number="achievements"
          type="number"
          step="0.0001"
          min="0"
          max="101"
          placeholder="达成率"
        />
      </div>
      <DialogFooter>
        <Button variant="outline" @click="closeDialog">取消</Button>
        <Button :disabled="!isValid" @click="handleSave">确定</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
