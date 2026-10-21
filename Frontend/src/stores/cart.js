import { defineStore } from 'pinia'
import { ref } from 'vue'
import axiosClient from '../api/axiosClient'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const count = ref(0)
  const totalAmount = ref(0)

  // 1. Hàm lấy giỏ hàng từ Backend (HttpSession)
  const fetchCart = async () => {
    try {
      const response = await axiosClient.get('/api/cart')
      items.value = response.data.items || []
      count.value = response.data.count || 0
      totalAmount.value = response.data.amount || 0
    } catch (error) {
      console.error("Lỗi tải giỏ hàng:", error)
    }
  }

  // 2. Hàm thêm sản phẩm (có kèm theo size)
  const addToCart = async (productId, size, quantity = 1) => {
    try {
      // Gọi đúng API endpoint /api/cart/add/{id}?size=... kèm theo qty nếu cần
      const response = await axiosClient.post(`/api/cart/add/${productId}?size=${size}`, { qty: quantity })
      // Cập nhật lại state sau khi thêm thành công
      await fetchCart()
      return { success: true, message: response.data.message || 'Thêm thành công!' }
    } catch (error) {
      console.error("Lỗi thêm giỏ hàng:", error)
      const msg = error.response?.data?.message || "Vui lòng đăng nhập!"
      return { success: false, message: msg }
    }
  }

  // 3. Hàm cập nhật số lượng
  const updateQuantity = async (id, size, qty) => {
    try {
      await axiosClient.put(`/api/cart/update/${id}?size=${size}&qty=${qty}`)
      await fetchCart()
    } catch (error) {
      console.error("Lỗi cập nhật giỏ hàng:", error)
    }
  }

  // 4. Hàm xóa sản phẩm
  const removeItem = async (id, size) => {
    try {
      await axiosClient.delete(`/api/cart/remove/${id}?size=${size}`)
      await fetchCart()
    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error)
    }
  }

  const clearCart = () => {
    items.value = []
    count.value = 0
    totalAmount.value = 0
  }

  return {
    items,
    count,
    totalAmount,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart
  }
})