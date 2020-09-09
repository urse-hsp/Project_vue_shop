import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '@/layouts/Login.vue')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '@/layouts/Home.vue')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '@/views/Welcome.vue')
// import Login from '@/components/Login.vue'
// import Home from '@/components/Home.vue'
// import Welcome from '@/components/Welcome.vue'

const Users = () => import(/* webpackChunkName: "User_Rights_Roles" */ '@/views/user/Users')
const Rights = () => import(/* webpackChunkName: "User_Rights_Roles" */ '@/views/power/Rights')
const Roles = () => import(/* webpackChunkName: "User_Rights_Roles" */ '@/views/power/Roles')
// import Users from '@/components/user/Users'
// import Rights from '@/components/power/Rights'
// import Roles from '@/components/power/Roles'

const Cate = () => import(/* webpackChunkName: "Cate_Params" */ '@/views/goods/Cate')
const Params = () => import(/* webpackChunkName: "Cate_Params" */ '@/views/goods/params')
// import Cate from '@/components/goods/Cate'
// import Params from '@/components/goods/params'

const List = () => import(/* webpackChunkName: "List_Add" */ '@/views/goods/List')
const Add = () => import(/* webpackChunkName: "List_Add" */ '@/views/goods/Add')
// import List from '@/components/goods/List'
// import Add from '@/components/goods/Add'

const Order = () => import(/* webpackChunkName: "Order_Report" */ '@/views/order/Order')
const Report = () => import(/* webpackChunkName: "Order_Report" */ '@/views/report/Report')
// import Order from '@/components/order/Order'
// import Report from '@/components/report/Report'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/Login', name: 'Login', component: Login },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', name: 'Welcome', component: Welcome },
      { path: '/users', name: 'Users', component: Users },
      { path: '/rights', name: 'Rights', component: Rights },
      { path: '/roles', name: 'Roles', component: Roles },
      { path: '/categories', name: 'Cate', component: Cate },
      { path: '/params', name: 'Params', component: Params },
      { path: '/goods', name: 'List', component: List },
      { path: '/goods/add', name: 'Add', component: Add },
      { path: '/orders', name: 'Order', component: Order },
      { path: '/reports', name: 'Report', component: Report }
    ]
  }
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

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
export default router
