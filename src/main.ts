import {createApp} from 'vue';
import { createPinia } from 'pinia';
//import './style.css';
import './assets/index.css';
import App from './App.vue';
import router from "./router";
import {createDiscreteApi} from 'naive-ui';

const pinia = createPinia();
const {
    message,
    dialog,
    notification,
    loadingBar
} = createDiscreteApi(["message", "dialog", "notification", "loadingBar"])

const app = createApp(App);

const defineGlobal = app.config.globalProperties;
defineGlobal.$nUseMessage = message;
defineGlobal.$nUseDialog = dialog;
defineGlobal.$nUseNotification = notification;
defineGlobal.$nUseLoadingBar = loadingBar;

app.use(router);
app.use(pinia);
app.mount('#app');

export const isDEBUG = false;
