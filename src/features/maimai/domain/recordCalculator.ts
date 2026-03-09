import type { MaimaiRecord, MaimaiMusicData, MaimaiChartStats, MaimaiLevel, MaimaiRate } from '../types'
import ScoreCoefficient from './scoreCoefficient'

const LEVEL_LABELS: MaimaiLevel[] = ['Basic', 'Advanced', 'Expert', 'Master', 'Re:MASTER', 'Utage']

export function computeRecord(
  record: MaimaiRecord,
  musicDataDict: Record<number, MaimaiMusicData>,
  chartStats: MaimaiChartStats,
  chartCombo: Record<number, number[]>
): MaimaiRecord {
  const result = { ...record }

  const musicData = musicDataDict[result.song_id]
  if (musicData) {
    result.ds = musicData.ds[result.level_index] || 0
  }

  if (result.ds && result.ds >= 7.0) {
    const arr = ('' + result.ds).split('.')
    if (arr[1] && ['6', '7', '8', '9'].includes(arr[1])) {
      result.level = arr[0] + '+'
    } else {
      result.level = arr[0] || ''
    }
  }

  if (result.song_id >= 100000) {
    result.ra = 0
    result.level_index = 5
  } else {
    result.ra = new ScoreCoefficient(result.achievements).ra(result.ds)
  }

  result.level_label = LEVEL_LABELS[result.level_index] || 'Basic'

  if (isNaN(result.ra)) {
    result.ra = 0
  }

  result.rate = getRateFromAchievements(result.achievements)

  const chartStat = chartStats.charts[result.song_id]?.[result.level_index]
  if (
    result.song_id > 100000 ||
    !chartStat ||
    chartStat.fit_diff === undefined
  ) {
    result.fit_diff = result.ds
  } else {
    result.fit_diff = chartStat.fit_diff
  }

  const combo = chartCombo[result.song_id]
  if (!combo) {
    result.dxScore_perc = 0
  } else {
    const maxDxScore = (combo[result.level_index] || 0) * 3
    result.dxScore_perc = maxDxScore > 0 ? (result.dxScore / maxDxScore) * 100 : 0
  }

  return result
}

export function getRateFromAchievements(achievements: number): MaimaiRate {
  if (achievements < 50) return 'd'
  if (achievements < 60) return 'c'
  if (achievements < 70) return 'b'
  if (achievements < 75) return 'bb'
  if (achievements < 80) return 'bbb'
  if (achievements < 90) return 'a'
  if (achievements < 94) return 'aa'
  if (achievements < 97) return 'aaa'
  if (achievements < 98) return 's'
  if (achievements < 99) return 'sp'
  if (achievements < 99.5) return 'ss'
  if (achievements < 100) return 'ssp'
  if (achievements < 100.5) return 'sss'
  return 'sssp'
}

export function calculateRating(
  records: MaimaiRecord[],
  isNew: boolean,
  musicDataDict: Record<number, MaimaiMusicData>
): number {
  const filteredRecords = records.filter((record) => {
    const music = musicDataDict[record.song_id]
    return music && music.basic_info.is_new === isNew
  })

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (b.ra !== a.ra) return b.ra - a.ra
    if (b.ds !== a.ds) return b.ds - a.ds
    return b.achievements - a.achievements
  })

  return sortedRecords.slice(0, isNew ? 15 : 35).reduce((sum, record) => sum + record.ra, 0)
}

export function sortRecords(records: MaimaiRecord[], isNew: boolean, musicDataDict: Record<number, MaimaiMusicData>): MaimaiRecord[] {
  const filteredRecords = records.filter((record) => {
    const music = musicDataDict[record.song_id]
    return music && music.basic_info.is_new === isNew
  })

  const sorted = [...filteredRecords].sort((a, b) => {
    if (b.ra !== a.ra) return b.ra - a.ra
    if (b.ds !== a.ds) return b.ds - a.ds
    return b.achievements - a.achievements
  })

  return sorted.map((record, index) => ({
    ...record,
    rank: index + 1,
  }))
}

export function getCoverPathById(songId: number): string {
  let id = songId
  if (id > 10000 && id <= 11000) {
    id -= 10000
  }
  return (id + '').padStart(5, '0') + '.png'
}
