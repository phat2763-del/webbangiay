<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card border-0 shadow-sm p-4">
          <h3 class="fw-bold mb-4 text-center">📁 Quản Lý Hồ Sơ Cá Nhân</h3>
          <form @submit.prevent="updateProfile">
            <div class="mb-3">
              <label class="form-label fw-bold">Tên đăng nhập (Username)</label>
              <input type="text" class="form-control bg-light" v-model="form.username" disabled />
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold">Họ và tên (*)</label>
              <input type="text" class="form-control" v-model="form.fullname" required placeholder="Nhập họ và tên..." />
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold">Địa chỉ Email (*)</label>
              <input type="email" class="form-control" v-model="form.email" required placeholder="Nhập email..." />
            </div>
            <button type="submit" class="btn btn-warning w-100 fw-bold py-2">Lưu Thay Đổi</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axiosClient from '../api/axiosClient'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const form = ref({ username: '', fullname: '', email: '' })

onMounted(async () => {
  try {
    const res = await axiosClient.get('/api/auth/check')
    if (res.data && res.data.username) {
      form.value = {
        username: res.data.username || '',
        fullname: res.data.fullname || '',
        email: res.data.email || ''
      }
      return
    }
  } catch (e) {
    console.warn("Chưa đồng bộ Session Backend, tự động lấy dữ liệu Auth Store")
  }

  if (authStore.user) {
    form.value = {
      username: authStore.user.username || '',
      fullname: authStore.user.fullname || '',
      email: authStore.user.email || ''
    }
  }
})

const updateProfile = async () => {
  try {
    await axiosClient.put('/api/auth/profile/update', {
      fullname: form.value.fullname,
      email: form.value.email
    })
    alert("Cập nhật hồ sơ thành công!")
    if (authStore.checkAuth) authStore.checkAuth()
  } catch (e) {
    alert("Cập nhật thất bại! Vui lòng kiểm tra lại kết nối.")
  }
}
</script>