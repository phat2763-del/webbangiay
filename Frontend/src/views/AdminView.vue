<template>
  <div class="container py-4">
    <div class="p-4 bg-dark text-white rounded-3 shadow mb-4 d-flex justify-content-between align-items-center">
      <div>
        <h2 class="fw-bold mb-1">⚙️ Trang Quản Trị Hệ Thống</h2>
        <p class="mb-0 text-muted">Quản lý sản phẩm, đơn hàng, tài khoản và báo cáo doanh thu CAMEDO SHOP</p>
      </div>
      <span class="badge bg-warning text-dark fs-6 p-2">Quyền: ADMIN</span>
    </div>

    <!-- Thanh tab chuyển đổi -->
    <ul class="nav nav-tabs mb-4 fw-bold">
      <li class="nav-item">
        <button class="nav-link" :class="{ active: currentTab === 'products' }" @click="currentTab = 'products'">📦 Quản lý Sản phẩm ({{ products.length }})</button>
      </li>
      <li class="nav-item">
        <button class="nav-link" :class="{ active: currentTab === 'orders' }" @click="currentTab = 'orders'">📋 Quản lý Đơn hàng ({{ orders.length }})</button>
      </li>
      <li class="nav-item">
        <button class="nav-link" :class="{ active: currentTab === 'accounts' }" @click="currentTab = 'accounts'">👥 Quản lý Tài khoản ({{ accounts.length }})</button>
      </li>
      <li class="nav-item">
        <button class="nav-link" :class="{ active: currentTab === 'reports' }" @click="currentTab = 'reports'">📊 Thống kê Doanh thu ({{ revenueReports.length }})</button>
      </li>
    </ul>

    <!-- TAB 1: SẢN PHẨM -->
    <div v-if="currentTab === 'products'">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4 class="fw-bold">Danh sách sản phẩm giày</h4>
        <button class="btn btn-primary fw-bold" @click="openProductModal()">+ Thêm sản phẩm mới</button>
      </div>
      <div class="card border-0 shadow-sm">
        <div class="card-body p-0">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-dark">
              <tr>
                <th class="ps-3">ID</th>
                <th>Ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Giá bán</th>
                <th>Trạng thái</th>
                <th class="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in products" :key="p.id">
                <td class="ps-3">#{{ p.id }}</td>
                <td>
                  <img :src="p.image ? 'http://localhost:8080/images/' + p.image : 'https://via.placeholder.com/40'" width="40" height="40" class="rounded object-fit-cover border bg-light">
                </td>
                <td class="fw-semibold">{{ p.name }}</td>
                <td><span class="badge bg-info text-dark">{{ p.category?.name || 'Chưa xếp' }}</span></td>
                <td class="text-danger fw-bold">{{ formatPrice(p.price) }} đ</td>
                <td>
                  <span class="badge" :class="p.available !== false ? 'bg-success' : 'bg-secondary'">
                    {{ p.available !== false ? 'Đang bán' : 'Ngừng bán' }}
                  </span>
                </td>
                <td class="text-center">
                  <button class="btn btn-sm btn-warning me-2 fw-bold" @click="openProductModal(p)">Sửa</button>
                  <button class="btn btn-sm btn-danger fw-bold" @click="deleteProduct(p.id)">Xóa</button>
                </td>
              </tr>
              <tr v-if="products.length === 0">
                <td colspan="7" class="text-center py-4 text-muted">Không tìm thấy sản phẩm nào.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 2: ĐƠN HÀNG -->
    <div v-if="currentTab === 'orders'">
      <h4 class="fw-bold mb-3">Danh sách đơn hàng từ khách hàng</h4>
      <div class="card border-0 shadow-sm">
        <div class="card-body p-0">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-dark">
              <tr>
                <th class="ps-3">Mã ĐH</th>
                <th>Khách hàng</th>
                <th>Địa chỉ giao</th>
                <th>Ngày đặt</th>
                <th>Trạng thái</th>
                <th class="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="o in orders" :key="o.id">
                <td class="ps-3 fw-bold">#{{ o.id }}</td>
                <td>{{ o.account?.fullname || o.account?.username || 'Khách' }}</td>
                <td>{{ o.address }}</td>
                <td>{{ formatDate(o.createDate) }}</td>
                <td>
                  <select class="form-select form-select-sm fw-bold" v-model="o.status" @change="updateOrderStatus(o.id, o.status)">
                    <option :value="0">⏳ Chờ xử lý</option>
                    <option :value="1">✅ Đã xác nhận</option>
                    <option :value="2">🚚 Đang giao</option>
                    <option :value="3">📦 Hoàn thành</option>
                    <option :value="4">❌ Đã hủy</option>
                  </select>
                </td>
                <td class="text-center">
                  <button class="btn btn-sm btn-info text-white fw-bold me-2" @click="viewOrderDetail(o)">Chi tiết</button>
                  <button class="btn btn-sm btn-danger fw-bold" @click="deleteOrder(o.id)">Xóa</button>
                </td>
              </tr>
              <tr v-if="orders.length === 0">
                <td colspan="6" class="text-center py-4 text-muted">Chưa có đơn hàng nào trong hệ thống.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 3: TÀI KHOẢN -->
    <div v-if="currentTab === 'accounts'">
      <h4 class="fw-bold mb-3">👥 Quản lý Thành viên & Phân quyền</h4>
      <div class="card border-0 shadow-sm">
        <div class="card-body p-0">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-dark">
              <tr>
                <th class="ps-3">Username</th>
                <th>Họ và tên</th>
                <th>Email</th>
                <th class="text-center">Quyền Admin</th>
                <th class="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="acc in accounts" :key="acc.username">
                <td class="ps-3 fw-bold">{{ acc.username }}</td>
                <td>{{ acc.fullname }}</td>
                <td>{{ acc.email }}</td>
                <td class="text-center">
                  <div class="form-check form-switch d-inline-block">
                    <input class="form-check-input" type="checkbox" :checked="acc.admin" @change="toggleAdminRole(acc)">
                  </div>
                </td>
                <td class="text-center">
                  <button class="btn btn-sm btn-danger fw-bold" @click="deleteAccount(acc.username)">Xóa</button>
                </td>
              </tr>
              <tr v-if="accounts.length === 0">
                <td colspan="5" class="text-center py-4 text-muted">Chưa có tài khoản nào.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- TAB 4: THỐNG KÊ -->
    <div v-if="currentTab === 'reports'">
      <h4 class="fw-bold mb-3">📊 THỐNG KÊ DOANH THU THEO LOẠI HÀNG</h4>
      <div class="card border-0 shadow-sm">
        <div class="card-body p-0">
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
              <tr v-for="(r, index) in revenueReports" :key="index">
                <td class="ps-3 fw-bold">{{ r.group || r.categoryName || r[0] }}</td>
                <td class="text-danger fw-bold">{{ formatPrice(r.sum || r.totalRevenue || r[1]) }} đ</td>
                <td>{{ r.count || r.totalQuantity || r[2] }}</td>
                <td>{{ formatPrice(r.max || r.maxPrice || r[3]) }} đ</td>
                <td>{{ formatPrice(r.min || r.minPrice || r[4]) }} đ</td>
                <td>{{ formatPrice(r.avg || r.avgPrice || r[5]) }} đ</td>
              </tr>
              <tr v-if="revenueReports.length === 0">
                <td colspan="6" class="text-center py-4 text-muted">Chưa có dữ liệu báo cáo thống kê.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- MODAL SẢN PHẨM -->
    <div v-if="showModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content shadow-lg">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title fw-bold">{{ isEdit ? '✏️ Sửa Sản Phẩm #' + formProduct.id : '➕ Thêm Sản Phẩm Mới' }}</h5>
            <button type="button" class="btn-close btn-close-white" @click="showModal = false"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveProduct">
              <div class="row g-3">
                <div class="col-md-8">
                  <label class="form-label fw-bold">Tên sản phẩm (*)</label>
                  <input type="text" class="form-control" v-model="formProduct.name" required placeholder="Nhập tên giày...">
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-bold">Giá bán (*)</label>
                  <input type="number" class="form-control" v-model.number="formProduct.price" required min="0">
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold">Danh mục (*)</label>
                  <select class="form-select" v-model="formProduct.categoryId" required>
                    <option value="">-- Chọn danh mục --</option>
                    <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold">Chọn Ảnh (photo_file)</label>
                  <input type="file" class="form-control" @change="handleFileUpload" accept="image/*">
                </div>
                <div class="col-md-12">
                  <label class="form-label fw-bold">Mô tả</label>
                  <textarea class="form-control" rows="3" v-model="formProduct.description" placeholder="Mô tả sản phẩm..."></textarea>
                </div>
                <div class="col-md-12">
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="availSwitch" v-model="formProduct.available">
                    <label class="form-check-label fw-bold" for="availSwitch">Đang mở bán</label>
                  </div>
                </div>
              </div>
              <div class="text-end mt-4">
                <button type="button" class="btn btn-secondary me-2 fw-bold" @click="showModal = false">Hủy</button>
                <button type="submit" class="btn btn-success fw-bold px-4">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL CHI TIẾT ĐƠN HÀNG -->
    <div v-if="selectedOrder" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content shadow-lg">
          <div class="modal-header bg-info text-white">
            <h5 class="modal-title fw-bold">📋 Chi Tiết Đơn Hàng #{{ selectedOrder.id }}</h5>
            <button type="button" class="btn-close btn-close-white" @click="selectedOrder = null"></button>
          </div>
          <div class="modal-body">
            <p><strong>Khách hàng:</strong> {{ selectedOrder.account?.fullname || selectedOrder.account?.username }}</p>
            <p><strong>Địa chỉ:</strong> {{ selectedOrder.address }}</p>
            <table class="table table-bordered align-middle mt-3">
              <thead class="table-light">
                <tr>
                  <th>Sản phẩm</th>
                  <th>Size</th>
                  <th>Giá</th>
                  <th>Số lượng</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in selectedOrder.orderDetails" :key="item.id">
                  <td>{{ item.product?.name }}</td>
                  <td>Size {{ item.size }}</td>
                  <td>{{ formatPrice(item.price) }} đ</td>
                  <td>{{ item.quantity }}</td>
                  <td class="fw-bold text-danger">{{ formatPrice(item.price * item.quantity) }} đ</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary fw-bold" @click="selectedOrder = null">Đóng</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axiosClient from '../api/axiosClient'

const currentTab = ref('products')
const products = ref([])
const orders = ref([])
const accounts = ref([])
const categories = ref([])
const revenueReports = ref([])

const showModal = ref(false)
const isEdit = ref(false)
const selectedOrder = ref(null)
const selectedFile = ref(null)

const formProduct = ref({ id: null, name: '', price: 0, description: '', available: true, categoryId: '' })

const formatPrice = (val) => new Intl.NumberFormat('vi-VN').format(val || 0)
const formatDate = (val) => val ? new Date(val).toLocaleDateString('vi-VN') : ''

const extractArray = (resData) => {
  if (!resData) return []
  if (Array.isArray(resData)) return resData
  if (Array.isArray(resData.content)) return resData.content
  return []
}

const loadAllData = async () => {
  // 1. Danh mục
  try {
    const cRes = await axiosClient.get('/api/categories').catch(() => axiosClient.get('/rest/categories'))
    categories.value = extractArray(cRes.data)
  } catch (err) { console.error("Lỗi danh mục:", err) }

  // 2. Sản phẩm
  try {
    const pRes = await axiosClient.get('/api/admin/products').catch(() => axiosClient.get('/api/products?size=100'))
    products.value = extractArray(pRes.data)
  } catch (err) { console.error("Lỗi sản phẩm:", err) }

  // 3. Đơn hàng (Quét qua cả 2 endpoint phòng hờ)
  try {
    const oRes = await axiosClient.get('/api/admin/orders').catch(() => axiosClient.get('/api/orders/admin/all'))
    orders.value = extractArray(oRes.data)
  } catch (err) { console.error("Lỗi đơn hàng:", err) }

  // 4. Tài khoản (Quét qua cả 2 endpoint phòng hờ)
  try {
    const aRes = await axiosClient.get('/api/admin/accounts').catch(() => axiosClient.get('/rest/accounts'))
    accounts.value = extractArray(aRes.data)
  } catch (err) { console.error("Lỗi tài khoản:", err) }

  // 5. Thống kê doanh thu
  try {
    const rRes = await axiosClient.get('/api/admin/report/revenue').catch(() => axiosClient.get('/rest/reports/revenue'))
    revenueReports.value = extractArray(rRes.data)
  } catch (err) { console.error("Lỗi thống kê:", err) }
}

const handleFileUpload = (e) => { selectedFile.value = e.target.files[0] }

const openProductModal = (product = null) => {
  selectedFile.value = null
  if (product) {
    isEdit.value = true
    formProduct.value = {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description || '',
      available: product.available !== false,
      categoryId: product.category?.id || categories.value[0]?.id || ''
    }
  } else {
    isEdit.value = false
    formProduct.value = { 
      id: null, 
      name: '', 
      price: 0, 
      description: '', 
      available: true, 
      categoryId: categories.value[0]?.id || '' 
    }
  }
  showModal.value = true
}

const saveProduct = async () => {
  try {
    const formData = new FormData()
    formData.append('name', formProduct.value.name)
    formData.append('price', formProduct.value.price)
    formData.append('description', formProduct.value.description || '')
    formData.append('available', formProduct.value.available)
    formData.append('category.id', formProduct.value.categoryId)
    formData.append('categoryId', formProduct.value.categoryId)
    
    if (selectedFile.value) {
      formData.append('photo_file', selectedFile.value)
    }

    if (isEdit.value) {
      await axiosClient.put(`/api/admin/products/${formProduct.value.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      alert("Cập nhật sản phẩm thành công!")
    } else {
      await axiosClient.post('/api/admin/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      alert("Thêm sản phẩm mới thành công!")
    }
    showModal.value = false
    loadAllData()
  } catch (e) {
    console.error("Lỗi lưu sản phẩm:", e)
    alert("Lưu thất bại! Vui lòng kiểm tra lại thông tin.")
  }
}

const deleteProduct = async (id) => {
  if (confirm(`Xóa sản phẩm #${id}?`)) {
    try {
      await axiosClient.delete(`/api/admin/products/${id}`)
      alert("Xóa thành công!")
      loadAllData()
    } catch (e) { alert("Không thể xóa sản phẩm này do đã phát sinh đơn hàng!") }
  }
}

const updateOrderStatus = async (id, status) => {
  try {
    await axiosClient.put(`/api/admin/orders/${id}/status`, { status })
    alert("Cập nhật trạng thái thành công!")
  } catch (e) { alert("Cập nhật thất bại!") }
}

const deleteOrder = async (id) => {
  if (confirm(`Xóa đơn hàng #${id}?`)) {
    try {
      await axiosClient.delete(`/api/admin/orders/${id}`)
      alert("Xóa đơn hàng thành công!")
      loadAllData()
    } catch (e) { alert("Không thể xóa đơn hàng!") }
  }
}

const viewOrderDetail = (o) => { selectedOrder.value = o }

const toggleAdminRole = async (acc) => {
  const newRole = !acc.admin
  try {
    await axiosClient.put(`/api/admin/accounts/${acc.username}/role`, { admin: newRole })
    acc.admin = newRole
    alert("Cập nhật quyền thành công!")
  } catch (e) { alert("Cập nhật quyền thất bại!") }
}

const deleteAccount = async (username) => {
  if (confirm(`Xóa tài khoản ${username}?`)) {
    try {
      await axiosClient.delete(`/api/admin/accounts/${username}`)
      alert("Xóa tài khoản thành công!")
      loadAllData()
    } catch (e) { alert("Không thể xóa tài khoản này!") }
  }
}

onMounted(() => { loadAllData() })
</script>