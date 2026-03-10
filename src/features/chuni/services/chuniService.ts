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
    const response = await api.get('/chunithmprober/music_data')
    const data = (response as { data?: unknown })?.data ?? response
    if (!Array.isArray(data)) {
      throw new Error('chunithmprober/music_data 响应格式错误：预期数组')
    }
    return data as ChuniMusicData[]
  },

  async getPlayerRecords(): Promise<ChuniPlayerRecordsResponse> {
    const response = await api.get('/chunithmprober/player/records')
    const data = (response as { data?: unknown })?.data ?? response
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new Error('chunithmprober/player/records 响应格式错误：预期对象')
    }
    return data as ChuniPlayerRecordsResponse
  },

  async getLatestVersion(): Promise<LatestVersionResponse> {
    const response = await api.get('/chunithmprober/latest_version')
    const data = (response as { data?: unknown })?.data ?? response
    if (
      !data ||
      typeof data !== 'object' ||
      Array.isArray(data) ||
      !Array.isArray((data as LatestVersionResponse).version)
    ) {
      throw new Error('chunithmprober/latest_version 响应格式错误：预期 { version: string[] }')
    }
    return data as LatestVersionResponse
  },
}
