import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/Login', name: 'Login', component: Login },
  { path: '/home', name: 'home', component: Home }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守位
// to 将要访问的路径
// from 从哪个路径跳转来的
// next 是一个函数表示放行
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
