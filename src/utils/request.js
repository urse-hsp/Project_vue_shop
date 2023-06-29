import axios from 'axios'
import NProgress from 'nprogress'

// 配置请求的跟路径
axios.defaults.baseURL = 'http://localhost:3333/api/private/v1/'
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
// response 拦截器
axios.interceptors.response.use(
  response => {
    const code = response.data.code
    if (code !== 200) {
      this.$message(response.data.message)
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject()
    }
    return response.data
  },
  error => {
    return Promise.reject(error) // error.response.data
  }
)

export default axios
