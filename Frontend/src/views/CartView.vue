<template>
  <div class="container py-5">
    <h3 class="fw-bold mb-4 text-center text-md-start">GIỎ HÀNG CỦA BẠN</h3>

    <!-- Trường hợp giỏ hàng trống -->
    <div v-if="!cartStore.items || cartStore.items.length === 0" class="text-center py-5 shadow-sm rounded bg-light">
      <div class="mb-3 display-1">🛒</div>
      <h4 class="fw-bold text-secondary mb-2">Giỏ hàng của bạn đang trống!</h4>
      <p class="text-muted mb-4">Hãy chọn thêm sản phẩm để tiếp tục mua sắm nhé.</p>
      <router-link to="/" class="btn btn-warning fw-bold px-4 py-2">
        <i class="bi bi-arrow-left me-1"></i> Mua sắm ngay
      </router-link>
    </div>

    <!-- Trường hợp có sản phẩm trong giỏ -->
    <div v-else class="row g-4">
      <!-- Danh sách sản phẩm -->
      <div class="col-lg-8">
        <div class="card shadow-sm border-0">
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table align-middle mb-0">
                <thead class="table-light">
                  <tr>
                    <th class="ps-3">Sản phẩm</th>
                    <th>Đơn giá</th>
                    <th style="width: 120px;">Số lượng</th>
                    <th>Thành tiền</th>
                    <th class="text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in cartStore.items" :key="item.id + '-' + item.size">
                    <td class="ps-3">
                      <div class="d-flex align-items-center gap-2">
                        <img 
                          :src="item.image ? 'http://localhost:8080/images/' + item.image : 'https://via.placeholder.com/60'" 
                          width="60" 
                          height="60" 
                          class="rounded object-fit-contain bg-light border"
                          alt="Product"
                        >
                        <div>
                          <span class="fw-semibold text-truncate d-block" style="max-width: 180px;">{{ item.name }}</span>
                          <small class="text-muted">Size: {{ item.size }}</small>
                        </div>
                      </div>
                    </td>
                    <td>{{ formatPrice(item.price) }} đ</td>
                    <td>
                      <input 
                        type="number" 
                        class="form-control form-control-sm text-center" 
                        v-model.number="item.quantity" 
                        @change="cartStore.updateQuantity(item.id, item.size, item.quantity)"
                        min="1"
                      >
                    </td>
                    <td class="fw-bold text-danger">{{ formatPrice((item.price || 0) * (item.quantity || 1)) }} đ</td>
                    <td class="text-center">
                      <!-- Truyền đủ id và size để xóa chính xác mục hàng -->
                      <button class="btn btn-sm btn-outline-danger border-0" @click="cartStore.removeItem(item.id, item.size)">
                        🗑️ Xóa
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Khung Thông tin Đặt hàng -->
      <div class="col-lg-4">
        <div class="card p-3 shadow-sm bg-light border-0">
          <h5 class="fw-bold mb-3">THÔNG TIN GIAO HÀNG</h5>
          <div class="mb-3">
            <label class="form-label text-muted small fw-bold">Địa chỉ nhận hàng (*)</label>
            <textarea class="form-control" rows="3" v-model="address" placeholder="Nhập địa chỉ nhận hàng chi tiết..."></textarea>
          </div>
          <hr>
          <div class="d-flex justify-content-between fs-5 fw-bold mb-3">
            <span>Tổng tiền:</span>
            <span class="text-danger">{{ formatPrice(cartStore.totalAmount) }} đ</span>
          </div>
          <button class="btn btn-danger w-100 btn-lg fw-bold" @click="handleCheckout">
            XÁC NHẬN ĐẶT HÀNG
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCartStore } from '../stores/cart'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import axiosClient from '../api/axiosClient'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const address = ref('')

const formatPrice = (val) => new Intl.NumberFormat('vi-VN').format(val || 0)

// Tự động tải dữ liệu giỏ hàng từ Session Backend ngay khi vừa mở trang
onMounted(() => {
  cartStore.fetchCart()
})

// Hàm xử lý đặt hàng
const handleCheckout = async () => {
  if (!authStore.user) {
    alert("Vui lòng đăng nhập để tiến hành thanh toán!")
    router.push('/login')
    return
  }

  if (!address.value.trim()) {
    alert('Vui lòng nhập địa chỉ giao hàng!')
    return
  }

  const orderData = {
    address: address.value,
    createDate: new Date(),
    account: { username: authStore.user.username },
    orderDetails: cartStore.items.map(item => ({
      product: { id: item.id },
      price: item.price,
      quantity: item.quantity,
      size: item.size
    }))
  }

  try {
    await axiosClient.post('/api/orders', orderData)
    alert('Đặt hàng thành công!')
    cartStore.clearCart()
    router.push('/')
  } catch (error) {
    console.error("Lỗi đặt hàng:", error)
    alert('Đặt hàng thất bại, vui lòng kiểm tra lại kết nối!')
  }
}
</script>