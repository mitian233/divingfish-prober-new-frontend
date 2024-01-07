import { createApp } from 'vue';
//import './style.css';
import './assets/index.css';
import App from './App.vue';
import router from "./router";
import { createDiscreteApi } from 'naive-ui';
import axios from "axios";

const { message, dialog, notification, loadingBar } = createDiscreteApi(["message", "dialog", "notification", "loadingBar"])

const app = createApp(App);

const defineGlobal = app.config.globalProperties;
defineGlobal.$nUseMessage = message;
defineGlobal.$nUseDialog = dialog;
defineGlobal.$nUseNotification = notification;
defineGlobal.$nUseLoadingBar = loadingBar;
defineGlobal.$axios = axios;

app.use(router);
app.mount('#app');
