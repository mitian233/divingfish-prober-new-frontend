export interface ChuniMusicData {
    // /api/chunithmprober/music_data
    id: number,
    title: string,
    ds: number[],
    level: string[],
    cids: number,
    charts: {
       combo: number,
       charter: string,
    }[],
    basic_info: {
        title: string,
        artist: string,
        genre: string,
        bpm: number,
        from: string,
    }
}

export interface ChuniPlayerBaseRating {
    cid: number,
    ds: number,
    fc: string,
    level: string,
    level_index: number,
    level_label: string,
    mid: number,
    ra: number,
    score: number,
    title: string,
    rank?: number,
}

export interface ChuniPlayerData {
    // /api/chunithmprober/player/records
    rating: number,
    records: {
        best: ChuniPlayerBaseRating[],
        r10: ChuniPlayerBaseRating[]
    },
    nickname: string,
}

export interface MaiMusic {
    title: string,
    artist: string,
    genre: string,
    bpm: number,
    release_data: string,
    from: string,
    is_new: boolean,
}

export interface MaiMusicData {
    // /api/maimaidxprober/music_data
    id: string,
    title: string,
    type: string, // "SD" | ""
    ds: number[],
    level: string[],
    cids: number[],
    charts: {
       notes: number[],
       charter: string,
    }[],
    basic_info: MaiMusic,
}

export interface MaiChartStat {
    // /api/maimaidxprober/chart_stats
    charts: {
        [key: string]: {
           cnt: number,
           diff: string,
           fit_diff: number,
           avg: number,
           avg_dx: number,
           std_dev: number,
           dist: number[],
           fc_dist: number[],
        }[]
    },
    diff_data: {
        [key: string]: {
            achievements: number,
            dist: number[],
            fc_dist: number[],
        }
    },
}

export interface MaiPlayerRecord {
    achievements: number,
    ds: number,
    dxScore: number,
    fc: string,
    fs: string,
    level: string,
    level_index: number,
    level_label: string,
    ra: number,
    rate: string,
    song_id: number,
    title: string,
    type: "DX" | "SD",
}
export interface MaiPlayerData {
    // /api/maimaidxprober/player/records
    additional_rating: number,
    nickname: string,
    username: string,
    plate: string,
    rating: number,
    records: MaiPlayerRecord[],
}

export const chuni_fc_filter_items = [
    { label: "空", value: 0},
    { label: "FC", value: "fullcombo"},
    { label: "FULL CHAIN", value: "fullchain"},
    { label: "AJ", value: "alljustice"},
]
export const chuni_level_filter_items = [
    { label: "Basic", value: 0 },
    { label: "Advanced", value: 1 },
    { label: "Expert", value: 2 },
    { label: "Master", value: 3 },
    { label: "Ultima", value: 4 },
    { label: "World's End", value: 5},
]
export const chuni_rate_filter_items = [
    { label: "SSS+", value: "sssp" },
    { label: "SSS", value: "sss" },
    { label: "SS+", value: "ssp" },
    { label: "SS", value: "ss" },
    { label: "S+", value: "sp" },
    { label: "S", value: "s" },
    { label: "AAA", value: "aaa" },
    { label: "AA", value: "aa" },
    { label: "A", value: "a" },
    { label: "BBB", value: "bbb"},
    { label: "BB", value: "bb"},
    { label: "B", value: "b" },
    { label: "C", value: "c" },
    { label: "D", value: "d" },
]
