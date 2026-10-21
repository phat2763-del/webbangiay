<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card border-0 shadow-sm p-4">
          <h3 class="fw-bold mb-4 text-center">🔒 Đổi Mật Khẩu</h3>
          <form @submit.prevent="changePassword">
            <div class="mb-3">
              <label class="form-label fw-bold">Mật khẩu hiện tại (*)</label>
              <input type="password" class="form-control" v-model="form.currentPassword" required placeholder="Nhập mật khẩu hiện tại..." />
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold">Mật khẩu mới (*)</label>
              <input type="password" class="form-control" v-model="form.newPassword" required placeholder="Nhập mật khẩu mới..." />
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold">Xác nhận mật khẩu mới (*)</label>
              <input type="password" class="form-control" v-model="form.confirmPassword" required placeholder="Nhập lại mật khẩu mới..." />
            </div>
            <button type="submit" class="btn btn-warning w-100 fw-bold py-2">Xác Nhận Đổi Mật Khẩu</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axiosClient from '../api/axiosClient'

const form = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const changePassword = async () => {
  if (form.value.newPassword !== form.value.confirmPassword) {
    alert("Mật khẩu xác nhận không khớp!")
    return
  }
  try {
    const res = await axiosClient.put('/api/auth/change-password', {
      currentPassword: form.value.currentPassword,
      newPassword: form.value.newPassword
    })
    alert(res.data?.message || "Đổi mật khẩu thành công!")
    form.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
  } catch (e) {
    alert(e.response?.data?.message || "Đổi mật khẩu thất bại! Vui lòng kiểm tra lại mật khẩu cũ.")
  }
}
</script>