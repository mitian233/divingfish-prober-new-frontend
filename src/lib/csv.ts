export function escapeCSVField(value: string | number): string {
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function exportToCSV(
  records: any[],
  fields: { key: string; label: string }[],
  filename: string = 'export.csv',
  encoding: 'UTF-8' | 'GBK' = 'UTF-8'
): void {
  const header = fields.map((f) => f.label).join(',')
  const rows = records.map((record) =>
    fields.map((f) => escapeCSVField(record[f.key])).join(',')
  )

  const text = [header, ...rows].join('\n')

  let blob: Blob
  if (encoding === 'GBK') {
    // 简化实现：先使用 UTF-8，后续可集成 gbk.js 库
    // 对于 Excel 兼容，添加 BOM
    const bom = new Uint8Array([0xef, 0xbb, 0xbf])
    const utf8Text = new TextEncoder().encode(text)
    const data = new Uint8Array(bom.length + utf8Text.length)
    data.set(bom, 0)
    data.set(utf8Text, bom.length)
    blob = new Blob([data], { type: 'text/csv;charset=utf-8' })
  } else {
    blob = new Blob([text], { type: 'text/csv;charset=utf-8' })
  }

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function exportMaimaiToCSV(records: any[], encoding: 'UTF-8' | 'GBK' = 'GBK'): void {
  const fields = [
    { key: 'title', label: '曲名' },
    { key: 'type', label: '类别' },
    { key: 'level_label', label: '难度' },
    { key: 'level', label: '等级' },
    { key: 'ds', label: '定数' },
    { key: 'achievements', label: '达成率' },
    { key: 'dxScore', label: 'DX分数' },
    { key: 'ra', label: 'DX Rating' },
  ]

  exportToCSV(records, fields, '乐谱.csv', encoding)
}

export function exportChuniToCSV(records: any[], encoding: 'UTF-8' | 'GBK' = 'GBK'): void {
  const fields = [
    { key: 'rank', label: '排名' },
    { key: 'title', label: '乐曲名' },
    { key: 'level', label: '难度' },
    { key: 'ds', label: '定数' },
    { key: 'score', label: '分数' },
    { key: 'ra', label: 'Rating' },
  ]

  exportToCSV(records, fields, '中二节奏.csv', encoding)
}
