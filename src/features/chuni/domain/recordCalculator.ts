import type { ChuniRecord, ChuniMusicData, ChuniLevel } from '../types'

export function calculateChuniRating(records: ChuniRecord[], limit: number): number {
  const sum = records.slice(0, limit).reduce((acc, record) => acc + record.ra, 0)
  return sum / 50
}

export function sortChuniRecords(
  records: ChuniRecord[],
  isNew: boolean,
  latestVersion: string[],
  chuniDataDict: Record<number, ChuniMusicData>
): ChuniRecord[] {
  const filteredRecords = records.filter((record) => {
    const music = chuniDataDict[record.mid]
    if (!music) return false
    return isNew === latestVersion.includes(music.basic_info.from)
  })

  const sorted = [...filteredRecords].sort((a, b) => {
    if (b.ra !== a.ra) return b.ra - a.ra
    if (b.ds !== a.ds) return b.ds - a.ds
    return b.score - a.score
  })

  return sorted.map((record, index) => ({
    ...record,
    rank: index + 1,
  }))
}

export function unlockAllChuni(
  records: ChuniRecord[],
  musicData: ChuniMusicData[]
): ChuniRecord[] {
  const currentCids = new Set(records.map((elem) => elem.cid))
  const result = [...records]
  let rank = records.length + 1
  const levelLabels: ChuniLevel[] = ['Basic', 'Advanced', 'Expert', 'Master', 'Ultima', "World's End"]

  for (const music of musicData) {
    for (let i = 0; i < music.ds.length; i++) {
      const cid = music.cids[i]
      if (cid === undefined || currentCids.has(cid)) continue
      const level = music.level[i]
      if (level === undefined || level === '-') continue

      result.push({
        rank: rank++,
        ds: music.ds[i] || 0,
        fc: '',
        title: music.title,
        level: level,
        mid: music.id,
        cid: cid,
        level_index: i,
        level_label: levelLabels[i] || 'Basic',
        score: 0,
        ra: 0.0,
      })
    }
  }

  return result
}

export function buildChuniDataDict(musicData: ChuniMusicData[]): Record<number, ChuniMusicData> {
  const result: Record<number, ChuniMusicData> = {}
  for (const music of musicData) {
    result[music.id] = music
  }
  return result
}
