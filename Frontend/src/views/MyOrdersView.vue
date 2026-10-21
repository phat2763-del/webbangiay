<template>
  <div class="container py-5">
    <h3 class="fw-bold mb-4">📦 Lịch Sử Đơn Hàng Của Bạn</h3>
    <div class="card border-0 shadow-sm">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table align-middle mb-0">
            <thead class="table-dark">
              <tr>
                <th class="ps-3">Mã ĐH</th>
                <th>Ngày đặt</th>
                <th>Địa chỉ nhận</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="o in myOrders" :key="o.id">
                <td class="ps-3 fw-bold">#{{ o.id }}</td>
                <td>{{ formatDate(o.createDate) }}</td>
                <td>{{ o.address }}</td>
                <td>
                  <span class="badge" :class="getStatusBadge(o.status)">
                    {{ getStatusText(o.status) }}
                  </span>
                </td>
              </tr>
              <tr v-if="myOrders.length === 0">
                <td colspan="4" class="text-center py-4 text-muted">Bạn chưa có đơn hàng nào trong hệ thống.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axiosClient from '../api/axiosClient'

const myOrders = ref([])

const formatDate = (val) => val ? new Date(val).toLocaleDateString('vi-VN') : ''

const getStatusText = (status) => {
  switch (status) {
    case 0: return '⏳ Chờ xử lý'
    case 1: return '✅ Đã xác nhận'
    case 2: return '🚚 Đang giao'
    case 3: return '📦 Hoàn thành'
    case 4: return '❌ Đã hủy'
    default: return 'Khác'
  }
}

const getStatusBadge = (status) => {
  switch (status) {
    case 0: return 'bg-warning text-dark'
    case 1: return 'bg-info'
    case 2: return 'bg-primary'
    case 3: return 'bg-success'
    case 4: return 'bg-danger'
    default: return 'bg-secondary'
  }
}

onMounted(async () => {
  try {
    const res = await axiosClient.get('/api/orders/history')
    myOrders.value = res.data || []
  } catch (e) {
    console.error("Lỗi tải lịch sử đơn hàng:", e)
  }
})
</script>