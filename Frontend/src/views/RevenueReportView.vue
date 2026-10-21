<template>
  <div class="container py-4">
    <h4 class="fw-bold mb-3 text-dark">📊 THỐNG KÊ DOANH THU THEO LOẠI HÀNG</h4>
    
    <div class="card border-0 shadow-sm">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-striped align-middle mb-0">
            <thead class="table-success text-dark">
              <tr>
                <th class="ps-3">Loại sản phẩm</th>
                <th>Tổng doanh thu</th>
                <th>Tổng số lượng</th>
                <th>Giá cao nhất</th>
                <th>Giá thấp nhất</th>
                <th>Giá trung bình</th>
              </tr>
            </thead>
            <tbody>
              <!-- Duyệt qua mảng dữ liệu trả về từ ReportRestController -->
              <tr v-for="(r, index) in revenueReports" :key="index">
                <td class="ps-3 fw-bold">{{ r.group }}</td>
                <td class="text-danger fw-bold">{{ formatPrice(r.sum) }} đ</td>
                <td>{{ r.count }}</td>
                <td>{{ formatPrice(r.max) }} đ</td>
                <td>{{ formatPrice(r.min) }} đ</td>
                <td>{{ formatPrice(r.avg) }} đ</td>
              </tr>
              <!-- Hiển thị khi chưa có dữ liệu -->
              <tr v-if="revenueReports.length === 0">
                <td colspan="6" class="text-center py-4 text-muted">Chưa có dữ liệu báo cáo thống kê.</td>
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

// Biến lưu danh sách báo cáo doanh thu
const revenueReports = ref([])

// Hàm định dạng tiền tệ kiểu Việt Nam (VD: 1.000.000)
const formatPrice = (val) => {
  return new Intl.NumberFormat('vi-VN').format(val || 0)
}

// Hàm gọi API lấy dữ liệu doanh thu từ Backend
const fetchRevenueReport = async () => {
  try {
    const response = await axiosClient.get('/api/admin/report/revenue')
    revenueReports.value = response.data || []
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu thống kê doanh thu:", error)
    alert("Không thể tải dữ liệu thống kê doanh thu từ hệ thống!")
  }
}

// Gọi API tự động khi component được load lên trang
onMounted(() => {
  fetchRevenueReport()
})
</script>

<style scoped>
/* Tùy chỉnh nhẹ cho bảng */
.table th {
  font-weight: 600;
}
</style>