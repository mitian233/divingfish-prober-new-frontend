import { reactive } from "vue";

type accountType = {
    username: string;
    password: string;
    token: string;
    isReg: boolean;
}
export const account: accountType = reactive({
    username: "",
    password: "",
    token: "",
    isReg: false,
});
