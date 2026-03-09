import type { MaimaiRecord, MaimaiMusicData, MaimaiLevel } from '../types'
import { computeRecord } from './recordCalculator'

const LEVEL_LABELS: MaimaiLevel[] = ['Basic', 'Advanced', 'Expert', 'Master', 'Re:MASTER', 'Utage']

export function mergeRecords(
  oldRecords: MaimaiRecord[],
  newRecords: MaimaiRecord[],
  musicDataDict: Record<number, MaimaiMusicData>,
  chartStats: any,
  chartCombo: Record<number, number[]>
): MaimaiRecord[] {
  const oldRecordsMap = new Map<number, number>()
  oldRecords.forEach((record, index) => {
    const key = record.song_id * 10 + record.level_index
    oldRecordsMap.set(key, index)
  })

  const result = [...oldRecords]

  for (const record of newRecords) {
    const key = record.song_id * 10 + record.level_index
    const existingIndex = oldRecordsMap.get(key)

    if (existingIndex !== undefined) {
      result[existingIndex] = record
    } else {
      result.push(record)
    }
  }

  return result.map((record) =>
    computeRecord(record, musicDataDict, chartStats, chartCombo)
  )
}

export function mergeOnAllMode(
  records: MaimaiRecord[],
  musicData: MaimaiMusicData[],
  musicDataDict: Record<number, MaimaiMusicData>,
  chartStats: any,
  chartCombo: Record<number, number[]>
): MaimaiRecord[] {
  const oldRecordsSet = new Set(
    records.map((r) => r.song_id * 10 + r.level_index)
  )

  const result = [...records]

  for (const music of musicData) {
    for (let j = 0; j < music.ds.length; j++) {
      const key = music.id * 10 + j
      if (!oldRecordsSet.has(key)) {
        const record: MaimaiRecord = {
          song_id: music.id,
          title: music.title,
          ds: music.ds[j] || 0,
          level: music.level[j] || '',
          level_index: j,
          level_label: LEVEL_LABELS[j] || 'Basic',
          type: music.type,
          achievements: 0,
          dxScore: 0,
          fc: '',
          fs: '',
          rate: 'd',
          ra: 0,
          fit_diff: music.ds[j] || 0,
          dxScore_perc: 0,
          block: true,
        }
        result.push(record)
      }
    }
  }

  return result.map((record) =>
    computeRecord(record, musicDataDict, chartStats, chartCombo)
  )
}

export function buildTitle2IdMap(musicData: MaimaiMusicData[]): Record<string, number> {
  const result: Record<string, number> = {}
  for (const music of musicData) {
    result[music.title + music.type] = music.id
  }
  return result
}

export function buildMusicDataDict(musicData: MaimaiMusicData[]): Record<number, MaimaiMusicData> {
  const result: Record<number, MaimaiMusicData> = {}
  for (const music of musicData) {
    result[music.id] = music
  }
  return result
}

export function buildChartCombo(musicData: MaimaiMusicData[]): Record<number, number[]> {
  const result: Record<number, number[]> = {}
  for (const music of musicData) {
    result[music.id] = music.charts.map((chart) =>
      chart.notes.reduce((prev, curr) => prev + curr, 0)
    )
  }
  return result
}
