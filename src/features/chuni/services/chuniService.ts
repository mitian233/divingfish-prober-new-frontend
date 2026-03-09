import api from '@/lib/api'
import type { ChuniMusicData, ChuniRecord } from '../types'

export interface ChuniPlayerRecordsResponse {
  records: {
    best: ChuniRecord[]
  }
}

export interface LatestVersionResponse {
  version: string[]
}

export const chuniService = {
  async getMusicData(): Promise<ChuniMusicData[]> {
    return api.get('/chunithmprober/music_data')
  },

  async getPlayerRecords(): Promise<ChuniPlayerRecordsResponse> {
    return api.get('/chunithmprober/player/records')
  },

  async getLatestVersion(): Promise<LatestVersionResponse> {
    return api.get('/chunithmprober/latest_version')
  },
}
