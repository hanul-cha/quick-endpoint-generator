import './style.css'

import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'

// Vue 앱 생성
const app = createApp(App)
const pinia = createPinia()

// 라우터 등록
app.use(pinia)
app.use(router)

// 앱 마운트
app.mount('#app')