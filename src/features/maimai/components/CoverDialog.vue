<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { MaimaiRecord } from '../types'
import { getCoverPathById } from '../domain/recordCalculator'

const props = defineProps<{
  open: boolean
  record: MaimaiRecord | null
}>()

const emit = defineEmits<{
  'update:open': [boolean]
}>()

const loading = ref(true)

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    loading.value = true
  }
})

function onImageLoad() {
  loading.value = false
}

function getCoverPath(songId: number): string {
  return `/covers/${getCoverPathById(songId)}`
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-[400px]">
      <DialogHeader>
        <DialogTitle>查看封面</DialogTitle>
        <p v-if="record" class="text-sm text-muted-foreground">
          <i><b>{{ record.title }}</b></i>
        </p>
      </DialogHeader>
      <div class="flex items-center justify-center min-h-[200px]">
        <div v-if="loading" class="text-muted-foreground">加载中...</div>
        <img
          v-if="record"
          :src="getCoverPath(record.song_id)"
          :alt="record.title"
          class="max-w-full max-h-[400px] object-contain"
          :class="{ 'opacity-0': loading }"
          @load="onImageLoad"
        />
      </div>
    </DialogContent>
  </Dialog>
</template>
