import api from '@/lib/api'
import type { MaimaiMusicData, MaimaiRecord, MaimaiChartStats } from '../types'

export interface PlayerRecordsResponse {
  username: string
  records: MaimaiRecord[]
}

export const maimaiService = {
  async getMusicData(): Promise<MaimaiMusicData[]> {
    const response = await api.get('/maimaidxprober/music_data')
    const data = (response as { data?: unknown })?.data ?? response
    if (!Array.isArray(data)) {
      throw new Error('maimaidxprober/music_data 响应格式错误：预期数组')
    }
    return data as MaimaiMusicData[]
  },

  async getPlayerRecords(): Promise<PlayerRecordsResponse> {
    return api.get('/maimaidxprober/player/records')
  },

  async updateRecords(records: MaimaiRecord[]): Promise<void> {
    const filteredRecords = records.filter((r) => !r.block)
    return api.post('/maimaidxprober/player/update_records', filteredRecords)
  },

  async updateRecord(record: MaimaiRecord): Promise<void> {
    return api.post('/maimaidxprober/player/update_record', record)
  },

  async getChartStats(): Promise<MaimaiChartStats> {
    const response = await api.get('/maimaidxprober/chart_stats')
    const data = (response as { data?: unknown })?.data ?? response
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new Error('maimaidxprober/chart_stats 响应格式错误：预期对象')
    }
    return data as MaimaiChartStats
  },
}
