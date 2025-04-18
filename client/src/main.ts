import App from './App.vue'
import { createApp } from 'vue'
import router from './router'

// Vue 앱 생성
const app = createApp(App)

// 라우터 등록
app.use(router)

// 앱 마운트
app.mount('#app')