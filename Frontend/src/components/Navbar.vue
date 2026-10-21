<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
    <div class="container">
      <router-link to="/" class="navbar-brand fw-bold text-warning">
        👟 CAMEDO SHOP
      </router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link to="/" class="nav-link">Trang chủ</router-link>
          </li>
          
          <!-- 🔴 Bổ sung Badge số lượng vào mục Giỏ hàng -->
          <li class="nav-item">
            <router-link to="/cart" class="nav-link position-relative">
              Giỏ hàng
              <span 
                v-if="cartStore.count > 0" 
                class="position-absolute top-25 start-100 translate-middle badge rounded-pill bg-danger"
                style="font-size: 0.6rem;"
              >
                {{ cartStore.count }}
              </span>
            </router-link>
          </li>

          <li class="nav-item" v-if="authStore.user">
            <router-link to="/admin" class="nav-link text-warning fw-bold">⚙️ Quản trị hệ thống</router-link>
          </li>
        </ul>

        <!-- Menu User Dropdown thuần Vue -->
        <ul class="navbar-nav">
          <template v-if="authStore.user">
            <li class="nav-item dropdown position-relative">
              <a 
                class="nav-link dropdown-toggle text-warning fw-bold cursor-pointer" 
                @click.prevent="toggleDropdown"
              >
                👤 Chào, {{ authStore.user.fullname || authStore.user.username }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end shadow" :class="{ 'show': dropdownOpen }" style="right: 0; left: auto; display: block;" v-if="dropdownOpen">
                <li><router-link to="/profile" class="dropdown-item" @click="dropdownOpen = false">📁 Hồ sơ cá nhân</router-link></li>
                <li><router-link to="/change-password" class="dropdown-item" @click="dropdownOpen = false">🔒 Đổi mật khẩu</router-link></li>
                <li><router-link to="/my-orders" class="dropdown-item" @click="dropdownOpen = false">📦 Đơn hàng của tôi</router-link></li>
                <li><hr class="dropdown-divider"></li>
                <li><button class="dropdown-item text-danger fw-bold" @click="handleLogout">🚪 Đăng xuất</button></li>
              </ul>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <router-link to="/login" class="btn btn-outline-warning btn-sm me-2 fw-bold">Đăng nhập</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/register" class="btn btn-warning btn-sm fw-bold">Đăng ký</router-link>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart' // 👈 Import cartStore
import { useRouter } from 'vue-router'
import axiosClient from '../api/axiosClient'

const authStore = useAuthStore()
const cartStore = useCartStore() // 👈 Khởi tạo cartStore
const router = useRouter()
const dropdownOpen = ref(false)

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

// 🟢 Tự động đồng bộ giỏ hàng từ Session Backend ngay khi load Navbar
onMounted(() => {
  cartStore.fetchCart()
})

const handleLogout = async () => {
  dropdownOpen.value = false
  try {
    await axiosClient.post('/api/auth/logout')
  } catch (e) {
    console.error("Lỗi đăng xuất:", e)
  } finally {
    authStore.logout()
    cartStore.clearCart() // Làm sạch giỏ hàng trên store khi logout
    alert("Đăng xuất thành công!")
    router.push('/login')
  }
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>