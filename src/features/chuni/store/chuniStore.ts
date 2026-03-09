import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { chuniService } from '../services/chuniService'
import type { ChuniMusicData, ChuniRecord } from '../types'
import { sortChuniRecords, calculateChuniRating, buildChuniDataDict } from '../domain/recordCalculator'
import { toast } from 'sonner'

export const useChuniStore = defineStore('chuni', () => {
  const musicData = ref<ChuniMusicData[]>([])
  const musicDataDict = ref<Record<number, ChuniMusicData>>({})
  const records = ref<ChuniRecord[]>([])
  const latestVersion = ref<string[]>([])
  const loading = ref(false)

  const b30Records = computed(() => {
    return sortChuniRecords(records.value, false, latestVersion.value, musicDataDict.value)
  })

  const n20Records = computed(() => {
    return sortChuniRecords(records.value, true, latestVersion.value, musicDataDict.value)
  })

  const b30Rating = computed(() => {
    return calculateChuniRating(b30Records.value, 30)
  })

  const n20Rating = computed(() => {
    return calculateChuniRating(n20Records.value, 20)
  })

  const totalRating = computed(() => {
    return b30Rating.value + n20Rating.value
  })

  async function fetchMusicData() {
    loading.value = true
    try {
      const [music, version] = await Promise.all([
        chuniService.getMusicData(),
        chuniService.getLatestVersion(),
      ])

      musicData.value = music
      musicDataDict.value = buildChuniDataDict(music)
      latestVersion.value = version.version

      toast.success('中二节奏乐曲信息获取完成')
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
      const data = await chuniService.getPlayerRecords()
      records.value = data.records.best
      toast.success('中二节奏用户分数信息获取完成')
    } catch (error) {
      toast.warning('未获取用户分数')
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    musicData,
    musicDataDict,
    records,
    latestVersion,
    loading,
    b30Records,
    n20Records,
    b30Rating,
    n20Rating,
    totalRating,
    fetchMusicData,
    fetchPlayerRecords,
  }
})
