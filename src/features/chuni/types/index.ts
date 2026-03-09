export type ChuniLevel = 'Basic' | 'Advanced' | 'Expert' | 'Master' | 'Ultima' | "World's End"

export interface ChuniMusicData {
  id: number
  title: string
  ds: number[]
  level: string[]
  cids: number[]
  basic_info: {
    from: string
  }
}

export interface ChuniRecord {
  rank: number
  ds: number
  fc: string
  title: string
  level: string
  mid: number
  cid: number
  level_index: number
  level_label: ChuniLevel
  score: number
  ra: number
}

export interface ChuniFilterOptions {
  scoreMin: number
  scoreMax: number
  dsMin: number
  dsMax: number
  levelIndex: number[]
}
