<template>
  <div class="container d-flex justify-content-center align-items-center py-5" style="min-height: 80vh;">
    <div class="card shadow p-4 border-0 rounded-3" style="width: 420px;">
      <div class="text-center mb-4">
        <span class="fs-1">👟</span>
        <h3 class="fw-bold mt-2 mb-1">Đăng Nhập Tài Khoản</h3>
        <p class="text-muted small">Chào mừng bạn quay trở lại với CAMEDO SHOP</p>
      </div>

      <div v-if="errorMessage" class="alert alert-danger py-2 small text-center" role="alert">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="onLogin">
        <div class="mb-3">
          <label class="form-label fw-bold">Tên đăng nhập</label>
          <input 
            v-model="username" 
            type="text" 
            class="form-control" 
            required 
            placeholder="Nhập tên đăng nhập..." 
          />
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">Mật khẩu</label>
          <input 
            v-model="password" 
            type="password" 
            class="form-control" 
            required 
            placeholder="Nhập mật khẩu..." 
          />
        </div>

        <button type="submit" class="btn btn-dark w-100 py-2 fw-bold mb-3" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
          {{ loading ? 'Đang xử lý...' : 'ĐĂNG NHẬP' }}
        </button>
      </form>

      <div class="text-center pt-3 border-top">
        <span class="text-muted small">Chưa có tài khoản? </span>
        <router-link to="/register" class="fw-bold text-decoration-none text-primary small">
          Đăng ký ngay
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axiosClient from '../api/axiosClient'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

const onLogin = async () => {
  errorMessage.value = ''
  loading.value = true
  try {
    // Khớp với LoginRequest ở Java (username, password)
    const response = await axiosClient.post('/api/auth/login', {
      username: username.value,
      password: password.value
    })

    // Dựa vào cấu trúc trả về của AuthRestController Java: response.data chứa { success, message, username, isAdmin }
    if (response.data.success) {
      authStore.setUser({
        username: response.data.username,
        isAdmin: response.data.isAdmin
      })
      alert(response.data.message || "Đăng nhập thành công!")
      router.push('/')
    } else {
      errorMessage.value = response.data.message || "Sai tên đăng nhập hoặc mật khẩu!"
    }
  } catch (error) {
    console.error("Lỗi đăng nhập:", error)
    if (error.response && error.response.data) {
      // Bắt message từ ResponseEntity.status(401).body(response) của Java
      errorMessage.value = error.response.data.message || "Sai tên đăng nhập hoặc mật khẩu!"
    } else {
      errorMessage.value = "Không thể kết nối đến máy chủ Backend!"
    }
  } finally {
    loading.value = false
  }
}
</script>