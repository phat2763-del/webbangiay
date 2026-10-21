<template>
  <div class="container py-5">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2 text-muted">Đang tải thông tin sản phẩm...</p>
    </div>

    <div v-else-if="product" class="row g-5 align-items-center">
      <!-- Ảnh sản phẩm -->
      <div class="col-md-6">
        <div class="card border-0 shadow-sm p-3 bg-light text-center">
          <img 
            :src="product.image ? 'http://localhost:8080/images/' + product.image : 'https://via.placeholder.com/400'" 
            class="img-fluid rounded object-fit-contain" 
            style="max-height: 400px;" 
            alt="Product Image" 
          />
        </div>
      </div>

      <!-- Thông tin chi tiết -->
      <div class="col-md-6">
        <span class="badge bg-info text-dark mb-2">{{ product.category?.name || 'Giày thời trang' }}</span>
        <h2 class="fw-bold mb-3">{{ product.name }}</h2>
        <h3 class="text-danger fw-bold mb-4">{{ formatPrice(product.price) }} đ</h3>
        
        <p class="text-muted mb-4">{{ product.description || 'Chưa có mô tả chi tiết cho sản phẩm này.' }}</p>

        <div class="mb-4">
          <label class="form-label fw-bold">Chọn Size:</label>
          <div class="d-flex gap-2">
            <button 
              v-for="size in [38, 39, 40, 41, 42, 43]" 
              :key="size" 
              class="btn btn-outline-dark btn-sm px-3"
              :class="{ active: selectedSize === size }"
              @click="selectedSize = size">
              {{ size }}
            </button>
          </div>
        </div>

        <button class="btn btn-warning fw-bold px-5 py-2 shadow-sm text-dark" @click="addToCart">
          🛒 Thêm vào giỏ hàng
        </button>
      </div>
    </div>

    <div v-else class="text-center py-5">
      <h4 class="text-danger fw-bold">Không tìm thấy thông tin sản phẩm!</h4>
      <router-link to="/" class="btn btn-dark mt-3">Quay về trang chủ</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '../stores/cart' // 👈 Import Pinia Store giỏ hàng
import axiosClient from '../api/axiosClient'

const route = useRoute()
const cartStore = useCartStore() // 👈 Khởi tạo cartStore

const product = ref(null)
const loading = ref(true)
const selectedSize = ref(40) // Mặc định chọn size 40

const formatPrice = (val) => new Intl.NumberFormat('vi-VN').format(val || 0)

const fetchProductDetail = async () => {
  const productId = route.params.id
  try {
    const res = await axiosClient.get(`/api/products/${productId}`).catch(() => axiosClient.get(`/rest/products/${productId}`))
    product.value = res.data
  } catch (e) {
    console.error("Lỗi tải chi tiết sản phẩm:", e)
  } finally {
    loading.value = false
  }
}

// Hàm thêm sản phẩm vào giỏ hàng thực tế thông qua Pinia & Session Backend
const addToCart = async () => {
  if (!selectedSize.value) {
    alert("Vui lòng chọn size sản phẩm!")
    return
  }

  // Gọi action addToCart trong store (truyền id sản phẩm, size và số lượng là 1)
  const result = await cartStore.addToCart(product.value.id, selectedSize.value, 1)

  if (result.success) {
    alert(`Đã thêm sản phẩm "${product.value.name}" (Size ${selectedSize.value}) vào giỏ hàng thành công!`)
  } else {
    // Nếu chưa đăng nhập, backend sẽ trả về 401 và hiển thị thông báo
    alert(result.message)
  }
}

onMounted(() => {
  fetchProductDetail()
})
</script>