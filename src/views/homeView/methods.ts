import {useStore} from "@/store";
import axios from "axios";
import ScoreCoefficient from "@/plugins/scoreCoefficient.ts";
import {useToast} from "@/components/ui/toast";
const {toast} = useToast();
const store = useStore();

export const chuniBestRating = () => {
    let ra = 0;
    if (store.chuni_obj.records == undefined) return 0.0;
    if (store.chuni_obj.records.best.length > 0) ra += store.chuni_obj.records.best[0].ra * 10;
    for (let i = 0; i < Math.min(store.chuni_obj.records.best.length, 30); i++) {
        ra += store.chuni_obj.records.best[i].ra;
    }
    return ra / 40;
}
export const title2id = () => {
    let obj: any = {};
    for (const music of store.music_data) {
        obj[music.title + music.type] = music.id
    }
    return obj;
}
export const sdData = () => {
    let data = store.records
        .filter((elem: any) => {
            return !store.is_new(elem);
        })
        .sort((a: any, b: any) => {
            return b.ra - a.ra;
        });
    for (let i = 0; i < data.length; i++) {
        data[i].rank = i + 1;
    }
    return data;
}
export const dxData = () => {
    let data = store.records
        .filter((elem: any) => {
            return store.is_new(elem);
        })
        .sort((a: any, b: any) => {
            return b.ra - a.ra;
        });
    for (let i = 0; i < data.length; i++) {
        data[i].rank = i + 1;
    }
    return data;
}
export const sdRa = () => {
    let ret = 0;
    for (let i = 0; i < Math.min(sdData.length, 35); i++) {
        ret += sdData()[i].ra;
    }
    return ret;
}
export const dxRa = () => {
    let ret = 0;
    for (let i = 0; i < Math.min(dxData.length, 15); i++) {
        ret += dxData()[i].ra;
    }
    return ret;
}
export const is_new = (record: any) => {
    return store.music_data_dict[record.song_id].basic_info.is_new;
}

export const rawToString = (text: string) => {
    if (text[text.length - 1] == "p" && text != "ap") {
        return text.substring(0, text.length - 1).toUpperCase() + "+";
    } else {
        return text.toUpperCase();
    }
}

export const coverRow = (record: any) => {
    store.coverVisible = true;
    if (record.song_id != store.coverItem.song_id)
        store.coverLoading = true;
    store.coverItem = record;
}

export const getCoverPathById = (songIdStr: string) => {
    let i = parseInt(songIdStr);
    if (i > 10000 && i <= 11000) i -= 10000;
    return (i + "").padStart(5, '0') + ".png";
}
export const sync = () => {
    // console.log(store.records);
    axios
        .post(
            "https://www.diving-fish.com/api/maimaidxprober/player/update_records",
            store.records.filter((elem: any) => {
                return elem.block !== true;
            })
        )
        .then(() => {
            toast({title: "数据同步成功！"});
        })
        .catch(() => {
            toast({title: "数据同步失败！", variant: "destructive"});
        });
}
export const merge = (records: Array<any>) => {
    // console.log(records);
    let oldRecords = Object.fromEntries(
        store.records.map((r: any, i: any) => [+r.song_id * 10 + r.level_index, i])
    );
    for (let record of records) {
        let i = oldRecords[+record.song_id * 10 + record.level_index];
        if (typeof i != "undefined") {
            store.records[i] = record;
        } else {
            store.records.push(record);
        }
    }
    for (let i = 0; i < store.records.length; i++) {
        computeRecord(store.records[i]);
    }
}
export const computeRecord = (record: any) => {
    if (store.music_data_dict[record.song_id])
        record.ds = store.music_data_dict[record.song_id].ds[record.level_index];
    if (record.ds && record.ds >= 7.0) {
        let arr = ("" + record.ds).split(".");
        if (["7", "8", "9"].indexOf(arr[1]) != -1) {
            record.level = arr[0] + "+";
        } else {
            record.level = arr[0];
        }
    }
    record.level_label = store.level_label[record.level_index];
    record.ra = new ScoreCoefficient(record.achievements).ra(record.ds);
    if (isNaN(record.ra)) record.ra = 0;
    // Update Rate
    if (record.achievements < 50) {
        record.rate = "d";
    } else if (record.achievements < 60) {
        record.rate = "c";
    } else if (record.achievements < 70) {
        record.rate = "b";
    } else if (record.achievements < 75) {
        record.rate = "bb";
    } else if (record.achievements < 80) {
        record.rate = "bbb";
    } else if (record.achievements < 90) {
        record.rate = "a";
    } else if (record.achievements < 94) {
        record.rate = "aa";
    } else if (record.achievements < 97) {
        record.rate = "aaa";
    } else if (record.achievements < 98) {
        record.rate = "s";
    } else if (record.achievements < 99) {
        record.rate = "sp";
    } else if (record.achievements < 99.5) {
        record.rate = "ss";
    } else if (record.achievements < 100) {
        record.rate = "ssp";
    } else if (record.achievements < 100.5) {
        record.rate = "sss";
    } else {
        record.rate = "sssp";
    }
    if (!store.chart_stats.charts[record.song_id] || !store.chart_stats.charts[record.song_id][record.level_index].fit_diff) {
        record.fit_diff = record.ds;
    } else {
        record.fit_diff = store.chart_stats.charts[record.song_id][record.level_index].fit_diff
    }
    if (!store.chart_combo[record.song_id]) {
        record.dxScore_perc = 0;
    } else {
        record.dxScore_perc =
            (record.dxScore /
                (store.chart_combo[record.song_id][record.level_index] * 3)) *
            100;
    }
}
