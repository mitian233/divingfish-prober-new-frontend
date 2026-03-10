<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type ComboStatus = 'finished' | 'full_combo' | 'all_justice' | 'all_justice_critical'

const open = ref(false)
const dsInput = ref<string>('')
const scoreInput = ref<string>('')
const comboStatus = ref<ComboStatus>('finished')

const result = computed(() => {
  const ds = Number(dsInput.value)
  const score = Number(scoreInput.value)
  if (!Number.isFinite(ds) || !Number.isFinite(score) || ds < 0 || score < 0) return '0.0000'
  return calculateOP(ds, score, comboStatus.value).toFixed(4)
})

function clear() {
  dsInput.value = ''
  scoreInput.value = ''
  comboStatus.value = 'finished'
}

function raCalculate(ds: number, score: number): number {
  if (score >= 1009000) return ds + 2.15
  if (score >= 1007500) return ds + 2 + Math.floor((score - 1007500) / 100) * 0.01
  if (score >= 1005000) return ds + 1.5 + Math.floor((score - 1005000) / 500) * 0.1
  if (score >= 1000000) return ds + 1 + Math.floor((score - 1000000) / 1000) * 0.1
  if (score >= 975000) return ds + Math.floor((score - 975000) / 2500) * 0.1
  if (score >= 925000) return ds - 3
  if (score >= 900000) return ds - 5
  if (score >= 800000) return (ds - 5) / 2
  return 0
}

function calculateOP(ds: number, score: number, status: ComboStatus): number {
  if (score >= 1007500) {
    let value = (ds + 2) * 5 + (score - 1007500) * 0.0015
    if (status === 'full_combo') value += 0.5
    if (status === 'all_justice') value += 1
    if (status === 'all_justice_critical') value += 1.25
    return value
  }
  if (score >= 975000) {
    return raCalculate(ds, score) * 5
  }
  return 0
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button variant="outline">单曲 OP 计算器</Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[540px]">
      <DialogHeader>
        <DialogTitle>单曲 OVER POWER 计算器</DialogTitle>
      </DialogHeader>

      <div class="space-y-4">
        <div class="space-y-2">
          <Label for="op-ds">定数</Label>
          <Input id="op-ds" v-model="dsInput" type="number" min="0" max="15.5" step="0.1" />
        </div>

        <div class="space-y-2">
          <Label for="op-score">分数</Label>
          <Input id="op-score" v-model="scoreInput" type="number" min="0" max="1010000" step="1" />
        </div>

        <div class="space-y-2">
          <Label>连击状态</Label>
          <Select v-model="comboStatus">
            <SelectTrigger>
              <SelectValue placeholder="选择连击状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="finished">已完成</SelectItem>
              <SelectItem value="full_combo">已达成 FULL COMBO</SelectItem>
              <SelectItem value="all_justice">已达成 ALL JUSTICE</SelectItem>
              <SelectItem value="all_justice_critical">已理论</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p class="text-sm">
          计算结果：
          <span class="font-semibold text-emerald-600">{{ result }}</span>
        </p>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="clear">清空</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
