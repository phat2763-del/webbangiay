<template>
  <!-- Chuyển thành container chuẩn để gom khung không bị giãn tràn màn hình -->
  <div class="container py-4">
    <!-- Banner -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="p-4 bg-dark text-white rounded-3 shadow-sm text-center" style="background: linear-gradient(135deg, #1e3c72, #2a5298);">
          <h2 class="fw-bold mb-2">CAMEDO SHOP - RUNNING SHOES</h2>
          <p class="mb-0 text-light">Khám phá bộ sưu tập giày chính hãng mới nhất với giá tốt nhất.</p>
        </div>
      </div>
    </div>

    <div class="row">
      <!-- Cột Danh mục (Sidebar) -->
      <div class="col-md-3">
        <div class="card shadow-sm mb-4">
          <div class="card-header bg-warning fw-bold text-dark">
            <i class="bi bi-list"></i> DANH MỤC
          </div>
          <ul class="list-group list-group-flush">
            <li 
              class="list-group-item list-group-item-action" 
              :class="{ active: selectedCategory === '' }"
              @click="selectCategory('')" 
              style="cursor: pointer;"
            >
              Tất cả sản phẩm
            </li>
            <li 
              class="list-group-item list-group-item-action" 
              v-for="cat in categories" 
              :key="cat.id"
              :class="{ active: selectedCategory === cat.id }"
              @click="selectCategory(cat.id)"
              style="cursor: pointer;"
            >
              {{ cat.name }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Cột Sản phẩm & Bộ Lọc -->
      <div class="col-md-9">
        <div class="card shadow-sm p-3 mb-4">
          <div class="row g-2">
            <div class="col-md-5">
              <input 
                type="text" 
                class="form-control" 
                placeholder="Tìm tên giày..." 
                v-model="searchKeyword"
                @keyup.enter="applyFilter"
              >
            </div>
            <div class="col-md-3">
              <select class="form-select" v-model="selectedCategory" @change="applyFilter">
                <option value="">Tất cả hãng</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
            <div class="col-md-2">
              <select class="form-select" v-model="sortOption" @change="applyFilter">
                <option value="default">Mặc định</option>
                <option value="asc">Giá tăng</option>
                <option value="desc">Giá giảm</option>
              </select>
            </div>
            <div class="col-md-2">
              <button class="btn btn-primary w-100 fw-bold" @click="applyFilter">
                LỌC
              </button>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="fw-bold text-secondary mb-0">KẾT QUẢ HIỂN THỊ (Trang {{ currentPage + 1 }} / {{ totalPages || 1 }})</h5>
          <span class="badge bg-primary fs-6">{{ totalElements }} SẢN PHẨM</span>
        </div>

        <!-- Lưới sản phẩm tỉ lệ chuẩn -->
        <div class="row row-cols-1 row-cols-md-3 g-3">
          <div class="col" v-for="product in products" :key="product.id">
            <div class="card h-100 shadow-sm product-card">
              <!-- Sửa khung ảnh chuẩn tỉ lệ contain không bị bẹt -->
              <div class="img-container p-2 bg-white rounded-top d-flex align-items-center justify-content-center" style="height: 220px; overflow: hidden;">
                <img 
                  :src="product.image ? 'http://localhost:8080/images/' + product.image : 'https://via.placeholder.com/300'" 
                  class="img-fluid" 
                  alt="Product Image"
                  style="max-height: 100%; max-width: 100%; object-fit: contain;"
                >
              </div>
              <div class="card-body d-flex flex-column p-3">
                <h6 class="card-title text-truncate fw-bold mb-2" :title="product.name">{{ product.name }}</h6>
                <p class="card-text text-danger fw-bold fs-5 mb-3">{{ formatPrice(product.price) }} đ</p>
                <div class="mt-auto d-flex justify-content-between gap-2">
                  <router-link :to="'/product/' + product.id" class="btn btn-outline-dark btn-sm flex-fill">Chi tiết</router-link>
                  <button class="btn btn-danger btn-sm flex-fill" @click="addToCart(product)">Thêm giỏ</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- THANH PHÂN TRANG THU GỌN -->
        <nav v-if="totalPages > 1" class="mt-4 mb-5" aria-label="Page navigation">
          <ul class="pagination pagination-sm justify-content-center mb-0">
            <li class="page-item" :class="{ disabled: currentPage === 0 }">
              <button class="page-link" @click="changePage(0)">Đầu</button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === 0 }">
              <button class="page-link" @click="changePage(currentPage - 1)">Trang trước</button>
            </li>

            <li 
              class="page-item" 
              v-for="page in displayedPages" 
              :key="page" 
              :class="{ active: page === currentPage }"
            >
              <button class="page-link" @click="changePage(page)">{{ page + 1 }}</button>
            </li>

            <li class="page-item" :class="{ disabled: currentPage === totalPages - 1 }">
              <button class="page-link" @click="changePage(currentPage + 1)">Trang sau</button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages - 1 }">
              <button class="page-link" @click="changePage(totalPages - 1)">Cuối</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import productService from '../api/productService';
import categoryService from '../api/categoryService';
import { useCartStore } from '../stores/cart';
import { watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// Theo dõi tín hiệu refresh từ Navbar khi bấm lại nút Trang chủ
watch(() => route.query.refresh, () => {
  searchKeyword.value = '';
  selectedCategory.value = '';
  sortOption.value = 'default';
  fetchProducts(0);
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const products = ref([]);
const categories = ref([]);
const searchKeyword = ref('');
const selectedCategory = ref('');
const sortOption = ref('default');
const cartStore = useCartStore();

const currentPage = ref(0);
const totalPages = ref(0);
const totalElements = ref(0);

const fetchCategories = async () => {
  try {
    const res = await categoryService.getAll();
    categories.value = res.data;
  } catch (err) {
    console.error("Lỗi danh mục:", err);
  }
};

const fetchProducts = async (page = 0) => {
  try {
    const res = await productService.getAll(page, 12, selectedCategory.value, searchKeyword.value, sortOption.value);
    if (res.data.content) {
      products.value = res.data.content;
      currentPage.value = res.data.number;
      totalPages.value = res.data.totalPages;
      totalElements.value = res.data.totalElements;
    } else {
      products.value = res.data;
      totalPages.value = 1;
      totalElements.value = res.data.length;
    }
  } catch (err) {
    console.error("Lỗi sản phẩm:", err);
  }
};

const displayedPages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const pages = [];
  
  let start = Math.max(0, current - 2);
  let end = Math.min(total - 1, current + 2);
  
  if (current <= 2) {
    end = Math.min(total - 1, 4);
  }
  if (current >= total - 3) {
    start = Math.max(0, total - 5);
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

const selectCategory = (cid) => {
  selectedCategory.value = cid;
  applyFilter();
};

const applyFilter = () => {
  fetchProducts(0);
};

const changePage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    fetchProducts(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const formatPrice = (value) => new Intl.NumberFormat('vi-VN').format(value);

const addToCart = (product) => {
  cartStore.addItem(product);
  alert('Đã thêm sản phẩm vào giỏ hàng!');
};

onMounted(() => {
  fetchCategories();
  fetchProducts(0);
});
</script>

<style scoped>
.product-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.1) !important;
}
</style>