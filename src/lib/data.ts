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
}

export interface ChuniPlayerData {
    // /api/chunithmprober/player/records
    rating: number,
    records: {
        best: ChuniPlayerBaseRating[],
        r10: ChuniPlayerBaseRating[]
    },
    username: string, // ?nickname
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
    basic_info: {
        title: string,
        artist: string,
        genre: string,
        bpm: number,
        release_data: string,
        from: string,
        is_new: boolean,
    }
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

export interface MaiPlayerData {
    // /api/maimaidxprober/player/records
    additional_rating: number,
    nickname: string,
    plate: string,
    rating: number,
    records: {
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
    }[]
}
