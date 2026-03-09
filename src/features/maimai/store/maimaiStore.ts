import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { maimaiService } from '../services/maimaiService'
import type { MaimaiMusicData, MaimaiRecord, MaimaiChartStats } from '../types'
import {
  buildMusicDataDict,
  buildChartCombo,
  mergeRecords,
} from '../domain/merge'
import { sortRecords, calculateRating } from '../domain/recordCalculator'
import { toast } from 'sonner'

export const useMaimaiStore = defineStore('maimai', () => {
  const musicData = ref<MaimaiMusicData[]>([])
  const musicDataDict = ref<Record<number, MaimaiMusicData>>({})
  const records = ref<MaimaiRecord[]>([])
  const chartStats = ref<MaimaiChartStats>({ charts: {} })
  const chartCombo = ref<Record<number, number[]>>({})
  const loading = ref(false)

  const sdData = computed(() => {
    return sortRecords(records.value, false, musicDataDict.value)
  })

  const dxData = computed(() => {
    return sortRecords(records.value, true, musicDataDict.value)
  })

  const sdRa = computed(() => {
    return calculateRating(records.value, false, musicDataDict.value)
  })

  const dxRa = computed(() => {
    return calculateRating(records.value, true, musicDataDict.value)
  })

  const totalRa = computed(() => sdRa.value + dxRa.value)

  async function fetchMusicData() {
    loading.value = true
    try {
      const [music, stats] = await Promise.all([
        maimaiService.getMusicData(),
        maimaiService.getChartStats(),
      ])

      musicData.value = music
      musicDataDict.value = buildMusicDataDict(music)
      chartStats.value = stats
      chartCombo.value = buildChartCombo(music)

      toast.success('舞萌 DX 乐曲信息获取完成')
    } catch (error) {
      toast.error('乐曲信息获取失败，请重新加载！')
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchPlayerRecords() {
    loading.value = true
    try {
      const data = await maimaiService.getPlayerRecords()
      records.value = mergeRecords(
        [],
        data.records,
        musicDataDict.value,
        chartStats.value,
        chartCombo.value
      )
      return data.username
    } catch (error) {
      toast.warning('未获取用户分数')
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updateRecord(record: MaimaiRecord) {
    try {
      await maimaiService.updateRecord(record)
      const index = records.value.findIndex(
        (r) => r.song_id === record.song_id && r.level_index === record.level_index
      )
      if (index !== -1) {
        records.value[index] = record
      }
      toast.success('修改已同步')
    } catch (error) {
      toast.error('修改失败！')
      throw error
    }
  }

  async function updateRecords(newRecords: MaimaiRecord[]) {
    try {
      await maimaiService.updateRecords(newRecords)
      records.value = newRecords
      toast.success('数据已同步完成')
    } catch (error) {
      toast.error('数据同步失败！')
      throw error
    }
  }

  function mergeNewRecords(newRecords: MaimaiRecord[]) {
    records.value = mergeRecords(
      records.value,
      newRecords,
      musicDataDict.value,
      chartStats.value,
      chartCombo.value
    )
  }

  return {
    musicData,
    musicDataDict,
    records,
    chartStats,
    chartCombo,
    loading,
    sdData,
    dxData,
    sdRa,
    dxRa,
    totalRa,
    fetchMusicData,
    fetchPlayerRecords,
    updateRecord,
    updateRecords,
    mergeNewRecords,
  }
})
