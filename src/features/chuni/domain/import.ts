import type { ChuniLevel, ChuniMusicData, ChuniRecord } from '../types'

const LEVEL_LABELS: ChuniLevel[] = ['Basic', 'Advanced', 'Expert', 'Master', 'Ultima', "World's End"]

interface ChuniImportLike {
  rank?: number
  ds?: number
  fc?: string
  title?: string
  level?: string
  mid?: number
  cid?: number
  level_index?: number
  score?: number
  ra?: number
}

function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let curr = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        curr += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
      continue
    }
    if (ch === ',' && !inQuotes) {
      result.push(curr)
      curr = ''
      continue
    }
    curr += ch
  }
  result.push(curr)
  return result.map((cell) => cell.trim())
}

function buildMusicLookup(musicData: ChuniMusicData[]) {
  const byCid = new Map<number, { music: ChuniMusicData; levelIndex: number }>()
  const byTitle = new Map<string, ChuniMusicData[]>()

  for (const music of musicData) {
    const list = byTitle.get(music.title) || []
    list.push(music)
    byTitle.set(music.title, list)

    for (let i = 0; i < music.cids.length; i++) {
      const cid = music.cids[i]
      if (cid !== undefined) {
        byCid.set(cid, { music, levelIndex: i })
      }
    }
  }

  return { byCid, byTitle }
}

function resolveByTitleAndLevel(
  title: string,
  level: string,
  ds: number,
  byTitle: Map<string, ChuniMusicData[]>
): { music: ChuniMusicData; levelIndex: number } | null {
  const candidates = byTitle.get(title)
  if (!candidates || candidates.length === 0) return null

  for (const music of candidates) {
    const exactLevelIndex = music.level.findIndex((v) => v === level)
    if (exactLevelIndex !== -1) {
      return { music, levelIndex: exactLevelIndex }
    }

    const dsIndex = music.ds.findIndex((v) => Math.abs((v || 0) - ds) < 0.001)
    if (dsIndex !== -1) {
      return { music, levelIndex: dsIndex }
    }
  }

  const fallback = candidates[0]
  return fallback ? { music: fallback, levelIndex: 0 } : null
}

function normalizeRecord(
  raw: ChuniImportLike,
  lookup: ReturnType<typeof buildMusicLookup>
): ChuniRecord | null {
  const inputTitle = raw.title?.trim() || ''
  const inputLevel = raw.level?.trim() || ''
  const inputDs = Number(raw.ds) || 0
  const inputScore = Number(raw.score) || 0
  const inputRa = Number(raw.ra) || 0
  const inputFc = raw.fc?.trim() || ''
  const inputCid = Number(raw.cid)

  let resolved: { music: ChuniMusicData; levelIndex: number } | null = null
  if (Number.isFinite(inputCid)) {
    resolved = lookup.byCid.get(inputCid) || null
  }
  if (!resolved && inputTitle) {
    resolved = resolveByTitleAndLevel(inputTitle, inputLevel, inputDs, lookup.byTitle)
  }
  if (!resolved) return null

  const { music, levelIndex } = resolved
  const cid = music.cids[levelIndex]
  const level = music.level[levelIndex]
  if (cid === undefined || !level || level === '-') return null

  return {
    rank: Number(raw.rank) || 0,
    ds: music.ds[levelIndex] ?? inputDs,
    fc: inputFc,
    title: music.title,
    level,
    mid: music.id,
    cid,
    level_index: levelIndex,
    level_label: LEVEL_LABELS[levelIndex] || 'Basic',
    score: inputScore,
    ra: inputRa,
  }
}

function parseFromJson(text: string): ChuniImportLike[] {
  const parsed = JSON.parse(text)
  if (Array.isArray(parsed)) return parsed as ChuniImportLike[]
  if (parsed && typeof parsed === 'object') {
    const maybeRecords = (parsed as any).records?.best
    if (Array.isArray(maybeRecords)) return maybeRecords as ChuniImportLike[]
  }
  return []
}

function parseFromCsv(text: string): ChuniImportLike[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  if (lines.length < 2) return []

  const headerLine = lines[0]
  if (!headerLine) return []
  const headers = parseCsvLine(headerLine)
  const headerMap = new Map<string, number>()
  headers.forEach((header, idx) => headerMap.set(header, idx))

  const titleIndex = headerMap.get('乐曲名') ?? headerMap.get('title') ?? 1
  const levelIndex = headerMap.get('难度') ?? headerMap.get('level') ?? 2
  const dsIndex = headerMap.get('定数') ?? headerMap.get('ds') ?? 3
  const scoreIndex = headerMap.get('分数') ?? headerMap.get('score') ?? 4
  const raIndex = headerMap.get('Rating') ?? headerMap.get('ra') ?? 5
  const rankIndex = headerMap.get('排名') ?? headerMap.get('rank') ?? 0

  return lines.slice(1).map((line) => {
    const cells = parseCsvLine(line)
    return {
      rank: Number(cells[rankIndex]) || 0,
      title: cells[titleIndex] || '',
      level: cells[levelIndex] || '',
      ds: Number(cells[dsIndex]) || 0,
      score: Number(cells[scoreIndex]) || 0,
      ra: Number(cells[raIndex]) || 0,
    }
  })
}

export function parseChuniImportData(text: string, musicData: ChuniMusicData[]): ChuniRecord[] {
  const trimmed = text.trim()
  if (!trimmed) return []

  const lookup = buildMusicLookup(musicData)
  let rawList: ChuniImportLike[] = []

  try {
    rawList = parseFromJson(trimmed)
  } catch {
    rawList = parseFromCsv(trimmed)
  }

  const result: ChuniRecord[] = []
  for (const raw of rawList) {
    const record = normalizeRecord(raw, lookup)
    if (record) {
      result.push(record)
    }
  }

  return result
}

export function mergeChuniRecords(oldRecords: ChuniRecord[], newRecords: ChuniRecord[]): ChuniRecord[] {
  const result = [...oldRecords]
  const indexByCid = new Map<number, number>()

  result.forEach((record, idx) => {
    indexByCid.set(record.cid, idx)
  })

  for (const record of newRecords) {
    const existingIdx = indexByCid.get(record.cid)
    if (existingIdx !== undefined) {
      result[existingIdx] = record
    } else {
      indexByCid.set(record.cid, result.length)
      result.push(record)
    }
  }

  return result
}
