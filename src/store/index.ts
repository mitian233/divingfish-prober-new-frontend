import {reactive} from "vue";
import {defineStore} from "pinia";
import {useToast} from "@/components/ui/toast";
import axios from "axios";
import {isDEBUG} from "@/main.ts";

const {toast} = useToast();

export {$loginStatus, $requireLogin, $requireResetPassword, $requireSignUp, _account} from "./account";

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

const store :storeType = reactive({
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
        { text: "排名", value: "rank" },
        { text: "封面", value: "cover", sortable: false},
        { text: "乐曲名", value: "title" },
        { text: "难度", value: "level", sortable: false },
        { text: "定数", value: "ds" },
        { text: "达成率", value: "achievements" },
        { text: "DX Rating", value: "ra" },
        { text: "拟合难度", value: "fit_diff" },
        { text: "操作", value: "actions", sortable: false },
    ],
});

const useStore = defineStore('globalMain',{
    state: () => store,
    getters: {},
    actions: {
        merge:function (records:Array<any>){
            // console.log(records);
            let oldRecords = Object.fromEntries(
                store.records.map((r, i) => [+r.song_id * 10 + r.level_index, i])
            );
            for (let record of records) {
                let i = oldRecords[+record.song_id * 10 + record.level_index];
                if (typeof i != "undefined") {
                    store.records[i]=record;
                } else {
                    store.records.push(record);
                }
            }
            for (let i = 0; i < store.records.length; i++) {
                //store.computeRecord(store.records[i]);
            }
        },
    },
});

export default useStore;
