import {reactive} from "vue";

export const $loginStatus: { isLogin: boolean, jwt: string } = reactive({
    isLogin: false,
    jwt: "",
});

export const $requireLogin: { value: boolean } = reactive({
    value: false,
});

export const $requireSignUp: { value: boolean } = reactive({
    value: false,
});

export const $requireResetPassword: { value: boolean } = reactive({
    value: false,
});

type accountType = {
    username: string,
    nickname: string,
    password: string,
    qq: string,
    qq_guild_id: string,
    import_token: string,
    records: Array<any>,
}
export const _account: accountType = reactive({
    username: "未登录",
    nickname: "未登录",
    password: "",
    qq: "",
    qq_guild_id: "",
    import_token: "",
    records: [],
});
