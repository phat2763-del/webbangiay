<template>
  <div class="container py-5">
    <h3 class="fw-bold mb-4">📦 Lịch Sử Đơn Hàng Của Bạn</h3>
    
    <div class="card border-0 shadow-sm">
      <div class="card-body p-0">
        <table class="table align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th class="ps-3">Mã đơn</th>
              <th>Ngày đặt</th>
              <th>Địa chỉ nhận</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in myOrders" :key="order.id">
              <td class="ps-3 fw-bold">#{{ order.id }}</td>
              <td>{{ order.createDate }}</td>
              <td>{{ order.address }}</td>
              <td><span class="badge bg-primary">Đang xử lý</span></td>
            </tr>
            <tr v-if="myOrders.length === 0">
              <td colspan="4" class="text-center py-4 text-muted">Bạn chưa có đơn hàng nào.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axiosClient from '../api/axiosClient'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const myOrders = ref([])

onMounted(async () => {
  if (authStore.user) {
    try {
      // Gọi API lấy đơn hàng theo username hoặc theo session hiện tại
      const res = await axiosClient.get(`/api/orders/user/${authStore.user.username}`)
      myOrders.value = res.data
    } catch (e) {
      console.error("Lỗi lấy lịch sử đơn hàng:", e)
    }
  }
})
</script>