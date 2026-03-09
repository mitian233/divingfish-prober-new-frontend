export type MaimaiLevel = 'Basic' | 'Advanced' | 'Expert' | 'Master' | 'Re:MASTER' | 'Utage'

export type MaimaiType = 'SD' | 'DX'

export type MaimaiRate = 'd' | 'c' | 'b' | 'bb' | 'bbb' | 'a' | 'aa' | 'aaa' | 's' | 'sp' | 'ss' | 'ssp' | 'sss' | 'sssp'

export interface MaimaiChart {
  notes: number[]
  fit_diff?: number
}

export interface MaimaiMusicData {
  id: number
  title: string
  type: MaimaiType
  ds: number[]
  level: string[]
  basic_info: {
    is_new: boolean
  }
  charts: MaimaiChart[]
}

export interface MaimaiRecord {
  song_id: number
  title: string
  ds: number
  level: string
  level_index: number
  level_label: MaimaiLevel
  type: MaimaiType
  achievements: number
  dxScore: number
  fc: string
  fs: string
  rate: MaimaiRate
  ra: number
  fit_diff: number
  dxScore_perc: number
  rank?: number
  block?: boolean
}

export interface MaimaiChartStats {
  charts: Record<number, MaimaiChartStatItem[]>
}

export interface MaimaiChartStatItem {
  fit_diff: number
  avg?: number
  avg_dx?: number
  std_dev?: number
}

export interface MaimaiFilterOptions {
  achievementMin: number
  achievementMax: number
  dsMin: number
  dsMax: number
  levelIndex: number[]
  fc: string
  fs: string
}
