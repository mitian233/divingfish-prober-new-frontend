import {reactive} from "vue";
import {defineStore} from "pinia";
import {useToast} from "@/components/ui/toast";
import axios from "axios";
import ScoreCoefficient from "@/plugins/scoreCoefficient.js";

const {toast} = useToast();

interface storeType {
    tableMode: number,
    tab: string,
    chart_stats: any,
    currentUpdate: any,
    currentAchievements: number,
    username: string,
    activeName: string,
    textarea: string,
    searchKey: string,
    records: Array<any>,
    music_data: Array<any>,
    music_data_dict: any,
    chuni_obj: any,
    chuni_records: Array<any>,
    chuni_data: Array<any>,
    chuni_data_dict: any,
    level_label: ["Basic", "Advanced", "Expert", "Master", "Re:MASTER"],
    feedbackText: string,
    feedbackVisible: boolean,
    loginVisible: boolean,
    registerVisible: boolean,
    dialogVisible: boolean,
    modifyAchievementVisible: boolean,
    coverVisible: boolean,
    coverLoading: boolean,
    coverItem: any,
    qrDialogVisible: boolean,
    qrcode: string,
    qrcodePrompt: string,
    ws: any,
    loading: boolean,
    chuniLoading: boolean,
    valid: boolean,
    valid2: boolean,
    exportVisible: boolean,
    exportEncoding: string,
    exportEncodingChuni: string,
    exportEncodings: ["GBK", "UTF-8"],
    logoutVisible: boolean,
    allModeVisible: boolean,
    allModeVisibleChuni: boolean,
    exportVisibleChuni: boolean,
    proSetting: boolean,
    proSettingChuni: boolean,
    chart_combo: any,
    headers: Array<{ text: string, value: string, sortable?: boolean }>,
}

const store: storeType = reactive({
    tableMode: 0, // mai or chuni
    tab: "",
    chart_stats: {},
    currentUpdate: {},
    currentAchievements: 0,
    username: "未登录",
    activeName: "SD",
    textarea: "",
    searchKey: "",
    records: [],
    music_data: [],
    music_data_dict: {},
    chuni_obj: {},
    chuni_records: [],
    chuni_data: [],
    chuni_data_dict: {},
    level_label: ["Basic", "Advanced", "Expert", "Master", "Re:MASTER"],
    feedbackText: "",
    feedbackVisible: false,
    loginVisible: false,
    registerVisible: false,
    dialogVisible: false,
    modifyAchievementVisible: false,
    coverVisible: false,
    coverLoading: true,
    coverItem: {},
    qrDialogVisible: false,
    qrcode: "",
    qrcodePrompt: "",
    ws: null,
    loading: false,
    chuniLoading: false,
    valid: false,
    valid2: false,
    exportVisible: false,
    exportEncoding: "UTF-8",
    exportEncodingChuni: "UTF-8",
    exportEncodings: ["GBK", "UTF-8"],
    logoutVisible: false,
    allModeVisible: false,
    allModeVisibleChuni: false,
    exportVisibleChuni: false,
    proSetting: false,
    proSettingChuni: false,
    chart_combo: {},
    headers: [
        {text: "排名", value: "rank"},
        {text: "封面", value: "cover", sortable: false},
        {text: "乐曲名", value: "title"},
        {text: "难度", value: "level", sortable: false},
        {text: "定数", value: "ds"},
        {text: "达成率", value: "achievements"},
        {text: "DX Rating", value: "ra"},
        {text: "拟合难度", value: "fit_diff"},
        {text: "操作", value: "actions", sortable: false},
    ],
});

export const useStore = defineStore('globalMain', {
    state: () => store,
    getters: {
        chuniBestRating: function () {
            let ra = 0;
            if (this.chuni_obj.records == undefined) return 0.0;
            if (this.chuni_obj.records.best.length > 0) ra += this.chuni_obj.records.best[0].ra * 10;
            for (let i = 0; i < Math.min(this.chuni_obj.records.best.length, 30); i++) {
                ra += this.chuni_obj.records.best[i].ra;
            }
            return ra / 40;
        },
        title2id: function () {
            let obj: any = {};
            for (const music of this.music_data) {
                obj[music.title + music.type] = music.id
            }
            return obj;
        },

        sdData: function () {
            let data: any = this.records
                .filter((elem: any) => {
                    return !this.is_new(elem);
                })
                .sort((a: any, b: any) => {
                    return b.ra - a.ra;
                });
            for (let i = 0; i < data.length; i++) {
                data[i].rank = i + 1;
            }
            return data;
        },
        dxData: function () {
            let data: any = this.records
                .filter((elem: any) => {
                    return this.is_new(elem);
                })
                .sort((a: any, b: any) => {
                    return b.ra - a.ra;
                });
            for (let i = 0; i < data.length; i++) {
                data[i].rank = i + 1;
            }
            return data;
        },
        sdRa: function () {
            let ret = 0;
            for (let i = 0; i < Math.min(this.sdData.length, 35); i++) {
                ret += this.sdData[i].ra;
            }
            return ret;
        },
        dxRa: function () {
            let ret = 0;
            for (let i = 0; i < Math.min(this.dxData.length, 15); i++) {
                ret += this.dxData[i].ra;
            }
            return ret;
        },
        is_new: function (record: any) {
            return this.music_data_dict[record.song_id].basic_info.is_new;
        },
    },
    actions: {
        rawToString: function (text: string) {
            if (text[text.length - 1] == "p" && text != "ap") {
                return text.substring(0, text.length - 1).toUpperCase() + "+";
            } else {
                return text.toUpperCase();
            }
        },
        coverRow: function (record: any) {
            this.coverVisible = true;
            if (record.song_id != this.coverItem.song_id)
                this.coverLoading = true;
            this.coverItem = record;
        },
        getCoverPathById: function (songIdStr: string) {
            let i = parseInt(songIdStr);
            if (i > 10000 && i <= 11000) i -= 10000;
            return (i + "").padStart(5, '0') + ".png";
        },
        sync: function () {
            // console.log(this.records);
            axios
                .post(
                    "https://www.diving-fish.com/api/maimaidxprober/player/update_records",
                    this.records.filter((elem: any) => {
                        return elem.block !== true;
                    })
                )
                .then(() => {
                    toast({title: "数据同步成功！"});
                })
                .catch(() => {
                    toast({title: "数据同步失败！", variant: "destructive"});
                });
        },
        merge: function (records: Array<any>) {
            // console.log(records);
            let oldRecords = Object.fromEntries(
                this.records.map((r: any, i: any) => [+r.song_id * 10 + r.level_index, i])
            );
            for (let record of records) {
                let i = oldRecords[+record.song_id * 10 + record.level_index];
                if (typeof i != "undefined") {
                    this.records[i] = record;
                } else {
                    this.records.push(record);
                }
            }
            for (let i = 0; i < store.records.length; i++) {
                this.computeRecord(store.records[i]);
            }
        },
        computeRecord: function (record: any) {
            if (this.music_data_dict[record.song_id])
                record.ds = this.music_data_dict[record.song_id].ds[record.level_index];
            if (record.ds && record.ds >= 7.0) {
                let arr = ("" + record.ds).split(".");
                if (["7", "8", "9"].indexOf(arr[1]) != -1) {
                    record.level = arr[0] + "+";
                } else {
                    record.level = arr[0];
                }
            }
            record.level_label = this.level_label[record.level_index];
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
            if (!this.chart_stats.charts[record.song_id] || !this.chart_stats.charts[record.song_id][record.level_index].fit_diff) {
                record.fit_diff = record.ds;
            } else {
                record.fit_diff = this.chart_stats.charts[record.song_id][record.level_index].fit_diff
            }
            if (!this.chart_combo[record.song_id]) {
                record.dxScore_perc = 0;
            } else {
                record.dxScore_perc =
                    (record.dxScore /
                        (this.chart_combo[record.song_id][record.level_index] * 3)) *
                    100;
            }
        },
    },
});

export {$loginStatus, $requireLogin, $requireResetPassword, $requireSignUp, _account} from "./account";
export default useStore;
