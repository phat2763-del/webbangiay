import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Import Bootstrap CSS (nếu dự án dùng Bootstrap)
import 'bootstrap/dist/css/bootstrap.min.css'

const app = createApp(App)

// Đăng ký Pinia và Router vào ứng dụng
app.use(createPinia())
app.use(router)

app.mount('#app')