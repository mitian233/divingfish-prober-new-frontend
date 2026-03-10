<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [boolean]
  confirm: []
}>()

function closeDialog() {
  emit('update:open', false)
}

function handleConfirm() {
  emit('confirm')
  closeDialog()
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>解锁全曲</DialogTitle>
      </DialogHeader>
      <p class="text-sm text-muted-foreground">
        解锁后可查看所有中二谱面定数数据，新增谱面分数默认为 0。
      </p>
      <DialogFooter>
        <Button variant="outline" @click="closeDialog">取消</Button>
        <Button variant="destructive" @click="handleConfirm">确认解锁</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
