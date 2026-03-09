import api from '@/lib/api'
import type { MaimaiMusicData, MaimaiRecord, MaimaiChartStats } from '../types'

export interface PlayerRecordsResponse {
  username: string
  records: MaimaiRecord[]
}

export const maimaiService = {
  async getMusicData(): Promise<MaimaiMusicData[]> {
    return api.get('/maimaidxprober/music_data')
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
    return api.get('/maimaidxprober/chart_stats')
  },
}
