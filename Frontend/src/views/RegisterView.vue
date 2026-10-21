<template>
  <div class="container d-flex justify-content-center align-items-center py-5" style="min-height: 80vh;">
    <div class="card shadow p-4 border-0 rounded-3" style="width: 450px;">
      <div class="text-center mb-4">
        <span class="fs-1">👟</span>
        <h3 class="fw-bold mt-2 mb-1">Đăng Ký Tài Khoản</h3>
        <p class="text-muted small">Tạo tài khoản để mua sắm và theo dõi đơn hàng</p>
      </div>

      <div v-if="errorMessage" class="alert alert-danger py-2 small text-center" role="alert">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="onRegister">
        <div class="mb-3">
          <label class="form-label fw-bold">Tên đăng nhập (*)</label>
          <input v-model="form.username" type="text" class="form-control" required placeholder="Nhập username..." />
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">Họ và tên (*)</label>
          <input v-model="form.fullname" type="text" class="form-control" required placeholder="Nhập họ và tên..." />
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">Email (*)</label>
          <input v-model="form.email" type="email" class="form-control" required placeholder="Nhập địa chỉ email..." />
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">Mật khẩu (*)</label>
          <input v-model="form.password" type="password" class="form-control" required placeholder="Tạo mật khẩu..." />
        </div>

        <button type="submit" class="btn btn-warning w-100 py-2 fw-bold text-dark mb-3" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-1"></span>
          {{ loading ? 'Đang tạo tài khoản...' : 'ĐĂNG KÝ' }}
        </button>
      </form>

      <div class="text-center pt-3 border-top">
        <span class="text-muted small">Đã có tài khoản? </span>
        <router-link to="/login" class="fw-bold text-decoration-none text-primary small">
          Đăng nhập ngay
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axiosClient from '../api/axiosClient'

const router = useRouter()
const errorMessage = ref('')
const loading = ref(false)

const form = ref({
  username: '',
  fullname: '',
  email: '',
  password: '',
  photo: 'user.png' // Bổ sung giá trị mặc định khớp với logic Controller Java để tránh lỗi CSDL
})

const onRegister = async () => {
  errorMessage.value = ''
  loading.value = true
  try {
    const response = await axiosClient.post('/api/auth/register', form.value)
    if (response.data.success) {
      alert(response.data.message || "Đăng ký thành công!")
      router.push('/login')
    } else {
      errorMessage.value = response.data.message || "Đăng ký thất bại!"
    }
  } catch (error) {
    console.error("Lỗi đăng ký:", error)
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data.message || "Tên đăng nhập đã tồn tại hoặc dữ liệu không hợp lệ!"
    } else {
      errorMessage.value = "Lỗi kết nối đến máy chủ Backend!"
    }
  } finally {
    loading.value = false
  }
}
</script>