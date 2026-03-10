<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Slider } from '@/components/ui/slider'

const props = defineProps<{
  modelValue?: { min: number; max: number; useDs: boolean }
}>()

const emit = defineEmits<{
  'update:modelValue': [{ min: number; max: number; useDs: boolean }]
}>()

const useDs = ref(props.modelValue?.useDs ?? false)

const levelLabels = [
  '1', '2', '3', '4', '5', '6', '7', '7+', '8', '8+', '9', '9+',
  '10', '10+', '11', '11+', '12', '12+', '13', '13+', '14', '14+', '15'
]

const levelMin = [
  1, 2, 3, 4, 5, 6, 7, 7.6, 8, 8.6, 9, 9.6, 10, 10.6, 11, 11.6, 12, 12.6,
  13, 13.6, 14, 14.6, 15
]

const levelMax = [
  1.9, 2.9, 3.9, 4.9, 5.9, 6.9, 7.5, 7.9, 8.5, 8.9, 9.5, 9.9, 10.5, 10.9,
  11.5, 11.9, 12.5, 12.9, 13.5, 13.9, 14.5, 14.9, 15.5
]

const dsRange = ref<[number, number]>([1, 15])
const levelRange = ref<[number, number]>([0, 22])

const minLabel = computed(() => {
  if (useDs.value) {
    return dsRange.value[0].toFixed(1)
  }
  return levelLabels[levelRange.value[0]] || '1'
})

const maxLabel = computed(() => {
  if (useDs.value) {
    return dsRange.value[1].toFixed(1)
  }
  return levelLabels[levelRange.value[1]] || '15'
})

watch([dsRange, levelRange, useDs], () => {
  if (useDs.value) {
    emit('update:modelValue', {
      min: dsRange.value[0],
      max: dsRange.value[1],
      useDs: true
    })
  } else {
    const minIdx = Math.min(levelRange.value[0], levelMin.length - 1)
    const maxIdx = Math.min(levelRange.value[1], levelMax.length - 1)
    emit('update:modelValue', {
      min: levelMin[minIdx] ?? 1,
      max: levelMax[maxIdx] ?? 15.5,
      useDs: false
    })
  }
})

function toggleUseDs() {
  if (!useDs.value) {
    const minIdx = Math.min(levelRange.value[0], levelMin.length - 1)
    const maxIdx = Math.min(levelRange.value[1], levelMax.length - 1)
    dsRange.value = [levelMin[minIdx] ?? 1, levelMax[maxIdx] ?? 15.5]
  } else {
    levelRange.value = [
      Math.max(0, levelMax.findIndex(l => l >= dsRange.value[0])),
      Math.max(0, levelMax.findIndex(l => l >= dsRange.value[1]))
    ]
  }
  useDs.value = !useDs.value
}

function filter(record: { ds: number; level: string }): boolean {
  if (useDs.value) {
    return record.ds >= dsRange.value[0] && record.ds <= dsRange.value[1]
  } else {
    const allowLevels = levelLabels.slice(levelRange.value[0], levelRange.value[1] + 1)
    return allowLevels.includes(record.level)
  }
}

defineExpose({ filter })
</script>

<template>
  <div class="flex flex-wrap items-center gap-4 px-4 py-2">
    <div class="flex-1 min-w-[200px]">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-sm text-muted-foreground">
          {{ useDs ? '定数' : '等级' }}
        </span>
        <span class="text-sm font-medium">
          {{ minLabel }} - {{ maxLabel }}
        </span>
      </div>
      <Slider
        v-if="useDs"
        v-model="dsRange"
        :min="1"
        :max="15"
        :step="0.1"
        class="w-full"
      />
      <Slider
        v-else
        v-model="levelRange"
        :min="0"
        :max="22"
        :step="1"
        class="w-full"
      />
    </div>
    <label class="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        :checked="useDs"
        @change="toggleUseDs"
        class="h-4 w-4"
      />
      <span class="text-sm">使用定数筛选</span>
    </label>
  </div>
</template>
