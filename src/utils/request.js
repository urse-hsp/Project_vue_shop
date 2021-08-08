import axios from 'axios'
import NProgress from 'nprogress'

// 配置请求的跟路径
axios.defaults.baseURL = 'http://47.96.118.55:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

export default axios
