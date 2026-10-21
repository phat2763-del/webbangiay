import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CartView from '../views/CartView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import AdminView from '../views/AdminView.vue'
import ProfileView from '../views/ProfileView.vue'
import ChangePasswordView from '../views/ChangePasswordView.vue'
import MyOrdersView from '../views/MyOrdersView.vue'
// 🟢 1. Thêm dòng import này vào đầu file router
import ProductDetailView from '../views/ProductDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    // 🟢 2. Thêm route chi tiết sản phẩm vào đây để khớp với URL /product/201
    {
      path: '/product/:id',
      name: 'productDetail',
      component: ProductDetailView
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: { requiresAdmin: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/change-password',
      name: 'changePassword',
      component: ChangePasswordView
    },
    {
      path: '/my-orders',
      name: 'myOrders',
      component: MyOrdersView
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: 'smooth' };
    }
  }
})

router.beforeEach((to, from, next) => {
  const userInfo = JSON.parse(localStorage.getItem('user_info'))
  
  if (to.meta.requiresAdmin) {
    if (userInfo && userInfo.isAdmin === true) {
      next()
    } else {
      alert("Cảnh báo: Bạn không có quyền truy cập trang Quản trị!")
      next('/')
    }
  } else {
    next()
  }
})

export default router