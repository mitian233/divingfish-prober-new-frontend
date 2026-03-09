const SCORE_COEFFICIENT_TABLE: [number, number, string][] = [
  [0, 0, 'd'],
  [10, 1.6, 'd'],
  [20, 3.2, 'd'],
  [30, 4.8, 'd'],
  [40, 6.4, 'd'],
  [50, 8.0, 'c'],
  [60, 9.6, 'b'],
  [70, 11.2, 'bb'],
  [75, 12.0, 'bbb'],
  [79.9999, 12.8, 'bbb'],
  [80, 13.6, 'a'],
  [90, 15.2, 'aa'],
  [94, 16.8, 'aaa'],
  [96.9999, 17.6, 's'],
  [97, 20.0, 's'],
  [98, 20.3, 'sp'],
  [98.9999, 20.6, 'sp'],
  [99, 20.8, 'ss'],
  [99.5, 21.1, 'ssp'],
  [99.9999, 21.4, 'ssp'],
  [100, 21.6, 'sss'],
  [100.4999, 22.2, 'sss'],
  [100.5, 22.4, 'sssp'],
]

export default class ScoreCoefficient {
  private a!: number
  private c!: number
  private r!: string
  private idx!: number

  constructor(achievements: number) {
    for (let i = 0; i < SCORE_COEFFICIENT_TABLE.length; i++) {
      const nextItem = SCORE_COEFFICIENT_TABLE[i + 1]
      if (
        i === SCORE_COEFFICIENT_TABLE.length - 1 ||
        (nextItem && achievements < nextItem[0])
      ) {
        const item = SCORE_COEFFICIENT_TABLE[i]
        if (item) {
          this.a = achievements
          this.c = item[1]
          this.r = item[2]
          this.idx = i
        }
        return
      }
    }
    this.a = 0
    this.c = 0
    this.r = 'd'
    this.idx = 0
  }

  setIdx(idx: number): void {
    const item = SCORE_COEFFICIENT_TABLE[idx]
    if (idx >= 0 && idx < SCORE_COEFFICIENT_TABLE.length && item) {
      this.a = item[0]
      this.c = item[1]
      this.r = item[2]
      this.idx = idx
    }
  }

  getMoreRaLocal(ds: number): { ra: number; achievements: number } | undefined {
    const ra = this.ra(ds) + 1
    const ach = Math.ceil(Math.min((ra * 100) / ds / this.c, 100.5) * 10000) / 10000

    const nextItem = SCORE_COEFFICIENT_TABLE[this.idx + 1]
    if (
      this.idx === SCORE_COEFFICIENT_TABLE.length - 1 ||
      (nextItem && ach < nextItem[0])
    ) {
      return { ra, achievements: ach }
    }
    return undefined
  }

  getTableLen(): number {
    return SCORE_COEFFICIENT_TABLE.length
  }

  ra(ds: number): number {
    return Math.floor(this.c * ds * Math.min(100.5, this.a) / 100)
  }

  getAchievements(): number {
    return this.a
  }

  getCoefficient(): number {
    return this.c
  }

  getRate(): string {
    return this.r
  }

  getIndex(): number {
    return this.idx
  }
}

export function calculateRa(achievements: number, ds: number): number {
  const sc = new ScoreCoefficient(achievements)
  return sc.ra(ds)
}

export function getRateLabel(achievements: number): string {
  const sc = new ScoreCoefficient(achievements)
  return sc.getRate()
}
