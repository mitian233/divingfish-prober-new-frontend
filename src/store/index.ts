import {reactive} from "vue";
import {defineStore} from "pinia";
import {useToast} from "@/components/ui/toast";
import {
    ChuniMusicData,
    ChuniPlayerBaseRating,
    ChuniPlayerData,
    computedMaiRecord,
    MaiChartStat,
    MaiMusicData,
    MaiPlayerRecord
} from "@/lib/data";

const {toast} = useToast();

interface storeType {
    tableMode: number,
    tab: string,
    chart_stats: MaiChartStat,
    currentUpdate: any,
    currentAchievements: number,
    username: string,
    activeName: string,
    textarea: string,
    searchKey: string,
    records: Array<MaiPlayerRecord>,
    music_data: Array<MaiMusicData>,
    music_data_dict: {
        [key: number]: MaiMusicData;
    },
    chuni_obj: ChuniPlayerData,
    chuni_records: Array<ChuniPlayerBaseRating>,
    chuni_data: Array<ChuniMusicData>,
    chuni_data_dict: {
        [key: number]: ChuniMusicData;
    },
    level_label: ["Basic", "Advanced", "Expert", "Master", "Re:MASTER", "Utage"],
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
}

const store: storeType = reactive({
    tableMode: 0, // mai or chuni
    tab: "",
    chart_stats: {
        charts: {},
        diff_data: {}
    },
    currentUpdate: {},
    currentAchievements: 0,
    username: "未登录",
    activeName: "SD",
    textarea: "",
    searchKey: "",
    records: [],
    music_data: [],
    music_data_dict: {},
    chuni_obj: {
        rating: 0,
        records: {
            best: [],
            r10: [],
        },
        nickname: "",
        username: "",
    },
    chuni_records: [],
    chuni_data: [],
    chuni_data_dict: {},
    level_label: ["Basic", "Advanced", "Expert", "Master", "Re:MASTER", "Utage"],
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
});

const isNew = (sid: number) => {
    const dict = store.music_data_dict;
    // console.log(dict[sid]);
    return dict[sid].basic_info.is_new;
}

export const useStore = defineStore('globalMain', {
    state: () => store,
    getters: {
        chuniVersions: function (): string[] {
            return Array.from(new Set(this.chuni_data.map((elem: ChuniMusicData) => elem.basic_info.from)))
        },
        chuniGenres: function (): string[] {
            return Array.from(new Set(this.chuni_data.map((elem: ChuniMusicData) => elem.basic_info.genre)))
        },
        chuniGenresItems: function (): { label: string, value: string }[] {
            return this.chuniGenres.map((elem: string) => {
                return {label: elem, value: elem}
            })
        },
        chuniVersionsItems: function (): { label: string, value: string }[] {
            return this.chuniVersions.map((elem: string) => {
                return {label: elem, value: elem}
            })
        },
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
                .filter((elem: MaiPlayerRecord) => {
                    return !isNew(elem.song_id);
                })
                .sort((a: any, b: any) => {
                    return b.ra - a.ra;
                });
            for (let i = 0; i < data.length; i++) {
                data[i].rank = i + 1;
            }
            return data as computedMaiRecord[];
        },
        dxData: function () {
            let data: any = this.records
                .filter((elem: MaiPlayerRecord) => {
                    return isNew(elem.song_id);
                })
                .sort((a: any, b: any) => {
                    return b.ra - a.ra;
                });
            for (let i = 0; i < data.length; i++) {
                data[i].rank = i + 1;
            }
            return data as computedMaiRecord[];
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
        }
    },
    actions: {

    },
});

export {$loginStatus, $requireLogin, $requireResetPassword, $requireSignUp, _account, isLoggedIn} from "./account";
export default useStore;
