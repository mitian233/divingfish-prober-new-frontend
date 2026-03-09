import type { MaimaiRecord, MaimaiType, MaimaiRate } from '@/features/maimai/types'

interface ParsedRecord {
  title: string
  level: string
  level_index: number
  type: MaimaiType
  achievements: number
  dxScore: number
  rate: string
  fc: string
  fs: string
  song_id?: number
}

export function parsePageData(
  pageData: string,
  title2IdMap: Record<string, number>
): MaimaiRecord[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(pageData, 'text/html')

  const records: ParsedRecord[] = []
  const nameElements = doc.querySelectorAll('.music_name_block.t_l.f_13.break')

  let linkDetected = false
  const labels = ['basic', 'advanced', 'expert', 'master', 'remaster']

  nameElements.forEach((nameEl) => {
    let title = nameEl.textContent || ''

    if (title === 'Link' && !linkDetected) {
      title = 'Link(CoF)'
      linkDetected = true
    }

    const row = nameEl.closest('tr')
    if (!row) return

    const cells = row.querySelectorAll('td')
    if (cells.length < 8) return

    const diffImg = cells[0]?.querySelector('img')
    const levelText = cells[1]?.textContent?.trim() || ''
    const scoreText = cells[3]?.textContent?.trim() || ''
    const dxScoreText = cells[4]?.textContent?.trim().replace(',', '') || ''
    const fsImg = cells[5]?.querySelector('img')
    const fcImg = cells[6]?.querySelector('img')
    const rateImg = cells[7]?.querySelector('img')

    const diffSrc = diffImg?.getAttribute('src') || ''
    const diffMatch = diffSrc.match(/diff_(.*)\.png/)
    const levelIndex = diffMatch && diffMatch[1] ? labels.indexOf(diffMatch[1]) : -1
    if (levelIndex === -1) return

    const rateSrc = rateImg?.getAttribute('src') || ''
    const rateMatch = rateSrc.match(/_icon_(.*)\.png/)
    const rate = rateMatch && rateMatch[1] ? rateMatch[1] : 'd'

    const fcSrc = fcImg?.getAttribute('src') || ''
    const fcMatch = fcSrc.match(/_icon_(.*)\.png/)
    const fc = fcMatch && fcMatch[1] ? fcMatch[1].replace('back', '') : ''

    const fsSrc = fsImg?.getAttribute('src') || ''
    const fsMatch = fsSrc.match(/_icon_(.*)\.png/)
    const fs = fsMatch && fsMatch[1] ? fsMatch[1].replace('back', '') : ''

    const parent = nameEl.closest('table')
    const parentId = parent?.id || ''
    let type: MaimaiType = 'SD'

    if (parentId) {
      type = parentId.slice(0, 3) === 'sta' ? 'SD' : 'DX'
    } else {
      const typeImg = parent?.querySelector('img[src*="_standard.png"], img[src*="_dx.png"]')
      const typeSrc = typeImg?.getAttribute('src') || ''
      if (typeSrc.includes('_standard.png')) {
        type = 'SD'
      } else if (typeSrc.includes('_dx.png')) {
        type = 'DX'
      }
    }

    const record: ParsedRecord = {
      title,
      level: levelText,
      level_index: levelIndex,
      type,
      achievements: parseFloat(scoreText) || 0,
      dxScore: parseInt(dxScoreText) || 0,
      rate,
      fc,
      fs,
    }

    records.push(record)
  })

  const result: MaimaiRecord[] = []
  const levelLabels = ['Basic', 'Advanced', 'Expert', 'Master', 'Re:MASTER', 'Utage'] as const
  
  for (const record of records) {
    const songId = title2IdMap[record.title + record.type]
    if (songId !== undefined) {
      result.push({
        ...record,
        song_id: songId,
        ds: 0,
        level_label: levelLabels[record.level_index] || 'Basic',
        ra: 0,
        fit_diff: 0,
        dxScore_perc: 0,
        rate: record.rate as MaimaiRate,
      })
    }
  }

  return result
}
