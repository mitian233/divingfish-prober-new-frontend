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
    password: string,
    token: string,
    isReg: boolean,
    records: Array<any>,
}
export const _account: accountType = reactive({
    username: "未登录",
    password: "",
    token: "",
    isReg: false,
    records: [],
});
