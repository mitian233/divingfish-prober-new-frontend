import { createApp } from 'vue'
import App from './App.vue'
import router from './app/router'
import { pinia } from './stores'
import './style.css'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
