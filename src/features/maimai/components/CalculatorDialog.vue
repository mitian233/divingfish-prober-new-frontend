<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import ScoreCoefficient from '../domain/scoreCoefficient'
import type { MaimaiRecord, MaimaiMusicData } from '../types'

const props = defineProps<{
  open: boolean
  currentSong?: MaimaiRecord | null
  musicDataDict?: Record<number, MaimaiMusicData>
}>()

const emit = defineEmits<{
  'update:open': [boolean]
}>()

const tab = ref<'score' | 'rating'>('score')

const noteTotal = ref({
  Tap: 0,
  Hold: 0,
  Slide: 0,
  Touch: 0,
  Break: 0,
})

const scoreInput = ref('')
const manualInput = ref(false)

const judgeInput = ref({
  Tap: { CRITICAL_PERFECT: 0, PERFECT: 0, GREAT: 0, GOOD: 0, MISS: 0 },
  Hold: { CRITICAL_PERFECT: 0, PERFECT: 0, GREAT: 0, GOOD: 0, MISS: 0 },
  Slide: { CRITICAL_PERFECT: 0, PERFECT: 0, GREAT: 0, GOOD: 0, MISS: 0 },
  Touch: { CRITICAL_PERFECT: 0, PERFECT: 0, GREAT: 0, GOOD: 0, MISS: 0 },
  Break: { CRITICAL_PERFECT: 0, PERFECT: 0, GREAT: 0, GOOD: 0, MISS: 0 },
})

const totalList = ref<{ id: number; total_score: number; PERFECT_A: number; PERFECT_B: number; GREAT_A: number; GREAT_B: number; GREAT_C: number }[]>([])

const ratingMode = ref<'from_ds' | 'from_achievements' | 'from_rating'>('from_ds')
const dsInput = ref('')
const ratingInput = ref('')
const achievementsInput = ref('')

const scoreMax = computed(() => {
  let sum = 0
  sum += noteTotal.value.Tap * 1
  sum += noteTotal.value.Hold * 2
  sum += noteTotal.value.Slide * 3
  sum += noteTotal.value.Touch * 1
  sum += noteTotal.value.Break * 5
  return sum
})

const exScoreMax = computed(() => noteTotal.value.Break)

function getMinAch(idx: number): number {
  const achTable = [0, 50, 60, 70, 75, 80, 90, 94, 97, 98, 99, 99.5, 100, 100.5, 101]
  return achTable[idx] ?? 0
}

const ratingList = computed(() => {
  if (ratingMode.value === 'from_ds') {
    if (dsInput.value === '') return []
    const ds = parseFloat(dsInput.value)
    const minAch = getMinAch(5)
    const maxAch = getMinAch(14)
    const moreRa: { ds: number; achievements: number; rating: number }[] = []
    
    for (let currAch4 = Math.round(minAch * 10000); currAch4 < Math.round(maxAch * 10000); currAch4 += 2500) {
      const currMinRa = new ScoreCoefficient(currAch4 / 10000).ra(ds)
      if (currMinRa > new ScoreCoefficient((currAch4 - 1) / 10000).ra(ds)) {
        moreRa.push({ ds, achievements: currAch4 / 10000, rating: currMinRa })
      }
      const currMaxRa = new ScoreCoefficient((currAch4 + 2499) / 10000).ra(ds)
      if (currMaxRa > currMinRa) {
        let l = currAch4, r = currAch4 + 2499, ans = r
        while (r >= l) {
          const mid = Math.floor((r + l) / 2)
          if (new ScoreCoefficient(mid / 10000).ra(ds) > currMinRa) {
            ans = mid
            r = mid - 1
          } else {
            l = mid + 1
          }
        }
        moreRa.push({ ds, achievements: ans / 10000, rating: new ScoreCoefficient(ans / 10000).ra(ds) })
      }
    }
    return moreRa.sort((a, b) => b.achievements - a.achievements)
  } else if (ratingMode.value === 'from_rating') {
    if (ratingInput.value === '') return []
    const rating = parseFloat(ratingInput.value)
    const moreRa: { ds: number; achievements: number; rating: number }[] = []
    
    for (let ds1 = 10; ds1 <= 150; ds1++) {
      const ds = ds1 / 10
      if (new ScoreCoefficient(101).ra(ds) < rating) continue
      let l = 0, r = 1010000, ans = r
      while (r >= l) {
        const mid = Math.floor((r + l) / 2)
        if (new ScoreCoefficient(mid / 10000).ra(ds) >= rating) {
          ans = mid
          r = mid - 1
        } else {
          l = mid + 1
        }
      }
      const lastItem = moreRa[moreRa.length - 1]
      if (!moreRa.length || Math.round((lastItem?.achievements ?? 0) * 10000) !== ans) {
        moreRa.push({ ds, achievements: ans / 10000, rating: new ScoreCoefficient(ans / 10000).ra(ds) })
      }
    }
    return moreRa.sort((a, b) => b.achievements - a.achievements)
  } else if (ratingMode.value === 'from_achievements') {
    if (achievementsInput.value === '') return []
    const ach = parseFloat(achievementsInput.value)
    const moreRa: { ds: number; achievements: number; rating: number }[] = []
    
    for (let ds1 = 10; ds1 <= 150; ds1++) {
      const ds = ds1 / 10
      moreRa.push({ ds, achievements: ach, rating: new ScoreCoefficient(ach).ra(ds) })
    }
    return moreRa.sort((a, b) => b.ds - a.ds)
  }
  return []
})

function calcBreakDistribution() {
  totalList.value = []
  
  const breakPerfect = judgeInput.value.Break.PERFECT
  const breakGreat = judgeInput.value.Break.GREAT
  
  // 计算基础分数
  let baseScore = 0, extraScore = 0
  
  // Tap, Hold, Slide, Touch
  const notes = [
    { name: 'Tap', weight: 1, total: noteTotal.value.Tap, input: judgeInput.value.Tap },
    { name: 'Hold', weight: 2, total: noteTotal.value.Hold, input: judgeInput.value.Hold },
    { name: 'Slide', weight: 3, total: noteTotal.value.Slide, input: judgeInput.value.Slide },
    { name: 'Touch', weight: 1, total: noteTotal.value.Touch, input: judgeInput.value.Touch },
  ]
  
  for (const note of notes) {
    baseScore += note.input.CRITICAL_PERFECT * note.weight * 1
    baseScore += note.input.PERFECT * note.weight * 1
    baseScore += note.input.GREAT * note.weight * 0.8
    baseScore += note.input.GOOD * note.weight * 0.5
  }
  
  // Break notes (simplified)
  baseScore += judgeInput.value.Break.CRITICAL_PERFECT * 5 * 1
  baseScore += judgeInput.value.Break.PERFECT * 5 * 1
  baseScore += judgeInput.value.Break.GREAT * 5 * 0.8
  baseScore += judgeInput.value.Break.GOOD * 5 * 0.5
  
  extraScore = judgeInput.value.Break.CRITICAL_PERFECT * 1
  extraScore += judgeInput.value.Break.PERFECT * 0
  
  // PF分布和GR分布
  const pfList: { PERFECT_A: number; PERFECT_B: number }[] = []
  for (let pa = 0; pa <= breakPerfect; pa++) {
    pfList.push({ PERFECT_A: pa, PERFECT_B: breakPerfect - pa })
  }
  
  const grList: { GREAT_A: number; GREAT_B: number; GREAT_C: number }[] = []
  for (let ga = 0; ga <= breakGreat; ga++) {
    for (let gb = 0; ga + gb <= breakGreat; gb++) {
      grList.push({ GREAT_A: ga, GREAT_B: gb, GREAT_C: breakGreat - ga - gb })
    }
  }
  
  let id = 0
  for (const { PERFECT_A, PERFECT_B } of pfList) {
    for (const { GREAT_A, GREAT_B, GREAT_C } of grList) {
      const baseScoreAdj = baseScore + GREAT_A * 4 + GREAT_B * 3 + GREAT_C * 2.5
      const extraScoreAdj = extraScore + PERFECT_A * 0.75 + PERFECT_B * 0.5
      
      if (scoreMax.value > 0 && exScoreMax.value > 0) {
        const totalScore = (baseScoreAdj / scoreMax.value) * 100 + extraScoreAdj / exScoreMax.value
        
        const scoreInputVal = parseFloat(scoreInput.value)
        if (isNaN(scoreInputVal) || Math.abs(totalScore - scoreInputVal) <= 0.0001) {
          totalList.value.push({ id: id++, total_score: totalScore, PERFECT_A, PERFECT_B, GREAT_A, GREAT_B, GREAT_C })
        }
      }
    }
  }
  
  totalList.value.sort((a, b) => b.total_score - a.total_score)
  
  if (totalList.value.length > 0) {
    toast.success(`计算完成，共找到${totalList.value.length}条结果`)
  } else {
    toast.warning('计算完成，未找到符合条件的结果')
  }
}

function fillFromSong(song: MaimaiRecord) {
  if (!props.musicDataDict) return
  const music = props.musicDataDict[song.song_id]
  if (!music) return
  
  const levelIdx = song.song_id > 100000 ? 0 : song.level_index
  const chartNotes = music.charts[levelIdx]?.notes
  
  if (!chartNotes) return
  
  const isDx = music.type === 'DX'
  noteTotal.value = {
    Tap: chartNotes[0] ?? 0,
    Hold: chartNotes[1] ?? 0,
    Slide: chartNotes[2] ?? 0,
    Touch: isDx ? (chartNotes[3] ?? 0) : 0,
    Break: isDx ? (chartNotes[4] ?? 0) : (chartNotes[3] ?? 0),
  }
  
  manualInput.value = false
  for (const note of ['Tap', 'Hold', 'Slide', 'Touch', 'Break'] as const) {
    judgeInput.value[note].CRITICAL_PERFECT = noteTotal.value[note]
    judgeInput.value[note].PERFECT = 0
    judgeInput.value[note].GREAT = 0
    judgeInput.value[note].GOOD = 0
    judgeInput.value[note].MISS = 0
  }
  
  dsInput.value = String(song.ds)
  ratingInput.value = String(song.ra)
  achievementsInput.value = String(song.achievements)
  
  toast.success(`已填入 ${song.type === 'DX' ? '[DX] ' : ''}${song.title} [${song.level_label}] 的数据`)
}

watch(() => props.currentSong, (song) => {
  if (song) {
    fillFromSong(song)
  }
})

defineExpose({ fillFromSong })
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>计算工具</DialogTitle>
        <p v-if="currentSong" class="text-sm text-muted-foreground">
          当前为 <i>{{ currentSong.type === 'DX' ? '[DX] ' : '' }}<b>{{ currentSong.title }}</b> [{{ currentSong.level_label }}]</i> 的数据
        </p>
      </DialogHeader>
      
      <Tabs v-model="tab" class="w-full">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value="score">分数线/绝赞分布计算</TabsTrigger>
          <TabsTrigger value="rating">Rating线计算</TabsTrigger>
        </TabsList>
        
        <TabsContent value="score" class="space-y-4">
          <div class="grid grid-cols-5 gap-2">
            <div class="space-y-1">
              <Label>Tap总数</Label>
              <Input v-model.number="noteTotal.Tap" type="number" class="h-8" />
            </div>
            <div class="space-y-1">
              <Label>Hold总数</Label>
              <Input v-model.number="noteTotal.Hold" type="number" class="h-8" />
            </div>
            <div class="space-y-1">
              <Label>Slide总数</Label>
              <Input v-model.number="noteTotal.Slide" type="number" class="h-8" />
            </div>
            <div class="space-y-1">
              <Label>Touch总数</Label>
              <Input v-model.number="noteTotal.Touch" type="number" class="h-8" />
            </div>
            <div class="space-y-1">
              <Label>Break总数</Label>
              <Input v-model.number="noteTotal.Break" type="number" class="h-8" />
            </div>
          </div>
          
          <div class="space-y-2">
            <Label>目标达成率</Label>
            <Input v-model="scoreInput" type="number" step="0.0001" min="0" max="101" placeholder="0-101" />
            <p v-if="scoreInput && noteTotal.Break && scoreMax" class="text-sm text-muted-foreground">
              达成{{ parseFloat(scoreInput).toFixed(4) }}%容错为 {{ ((101 - parseFloat(scoreInput)) / 100 / (0.2 / scoreMax)).toFixed(3) }}个Tap GREAT
            </p>
          </div>
          
          <div class="border rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <input type="checkbox" v-model="manualInput" class="h-4 w-4" />
              <Label>手动填充判定表（简化版）</Label>
            </div>
            
            <Button @click="calcBreakDistribution" class="mt-2">计算可能的绝赞分布</Button>
            
            <div v-if="totalList.length > 0" class="mt-4 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>达成率</TableHead>
                    <TableHead>PF (0.75%)</TableHead>
                    <TableHead>PF (0.5%)</TableHead>
                    <TableHead>GR (2000)</TableHead>
                    <TableHead>GR (1500)</TableHead>
                    <TableHead>GR (1250)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="item in totalList.slice(0, 20)" :key="item.id">
                    <TableCell>{{ item.total_score.toFixed(8) }}%</TableCell>
                    <TableCell>{{ item.PERFECT_A }}</TableCell>
                    <TableCell>{{ item.PERFECT_B }}</TableCell>
                    <TableCell>{{ item.GREAT_A }}</TableCell>
                    <TableCell>{{ item.GREAT_B }}</TableCell>
                    <TableCell>{{ item.GREAT_C }}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="rating" class="space-y-4">
          <div class="flex gap-4">
            <label class="flex items-center gap-2">
              <input type="radio" v-model="ratingMode" value="from_ds" class="h-4 w-4" />
              <span>按定数计算</span>
            </label>
            <label class="flex items-center gap-2">
              <input type="radio" v-model="ratingMode" value="from_achievements" class="h-4 w-4" />
              <span>按达成率计算</span>
            </label>
            <label class="flex items-center gap-2">
              <input type="radio" v-model="ratingMode" value="from_rating" class="h-4 w-4" />
              <span>按Rating计算</span>
            </label>
          </div>
          
          <div v-if="ratingMode === 'from_ds'" class="space-y-2">
            <Label>定数</Label>
            <Input v-model="dsInput" type="number" step="0.1" min="1" max="15" placeholder="1-15" />
          </div>
          
          <div v-else-if="ratingMode === 'from_achievements'" class="space-y-2">
            <Label>达成率</Label>
            <Input v-model="achievementsInput" type="number" step="0.0001" min="0" max="101" placeholder="0-101" />
          </div>
          
          <div v-else class="space-y-2">
            <Label>目标Rating</Label>
            <Input v-model="ratingInput" type="number" step="1" min="0" max="300" placeholder="0-300" />
          </div>
          
          <div v-if="ratingList.length > 0" class="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>定数</TableHead>
                  <TableHead>达成率</TableHead>
                  <TableHead>Rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="item in ratingList" :key="`${item.ds}-${item.achievements}`">
                  <TableCell>{{ item.ds.toFixed(1) }}</TableCell>
                  <TableCell>{{ item.achievements.toFixed(4) }}%</TableCell>
                  <TableCell>{{ item.rating }}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div v-else class="text-center text-muted-foreground py-4">
            没有符合条件的结果
          </div>
        </TabsContent>
      </Tabs>
    </DialogContent>
  </Dialog>
</template>
