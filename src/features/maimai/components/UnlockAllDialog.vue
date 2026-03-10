<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [boolean]
  'confirm': []
}>()

function handleConfirm() {
  emit('confirm')
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
        <DialogTitle>确认</DialogTitle>
        <DialogDescription>
          解锁全曲可以让您看到所有谱面的定数数据和相对难度，但您无法对这些谱面进行修改。确定解锁全曲？
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" @click="closeDialog">取消</Button>
        <Button @click="handleConfirm">解锁</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
