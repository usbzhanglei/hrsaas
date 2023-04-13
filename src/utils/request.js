import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'
import store from '@/store'
import { getTimeStamp } from '@/utils/auth'
const TimeOut = 60 * 60 // 定义超时时间
const service = axios.create({
  // 当执行 npm run dev => .env.VUE_APP_BASE_API => /api => 跨域代理
  baseURL: process.env.VUE_APP_BASE_API, // npm run dec => /api       npm run build => /prod-api
  timeout: 5000 // 设置超时时间
})
// 请求拦截器
// 在请求拦截器中统一注入token
service.interceptors.request.use(config => {
  // config 是请求的配置信息
  // 注入token
  if (store.getters.token) {
    // 只有在有token的情况下才有必要检测时间戳是否超时
    if (IsCheckTimeOut()) {
      // 如果为true 过期了
      // token没用了 因为超时了
      store.dispatch('user/logout') // 登出操作
      // 跳转到登录页
      router.push('/login')
      return Promise.reject(new Error('token超时了'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config // config必须返回 如果不返回则没有请求信息
}, error => {
  return Promise.reject(error)
})
// 响应拦截器
service.interceptors.response.use(response => {
  // axios 默认加一层data
  const { success, message, data } = response.data
  //   要根据success的成功与否决定下面的操作
  if (success) {
    return data
  } else {
    // 业务已经错误了 还能进then ? 不能 ！ 应该进catch
    Message.error(message) // 提示错误消息
    return Promise.reject(new Error(message))
  }
}, error => {
  // error 信息 里面会有 response 对象
  if (error && error.response && error.response.data.code === 10002) {
    // 当等于10002时 表示后端告诉我们token超时
    store.dispatch('user/logout') // 登出action 删除token
    router.push('/login')
  } else {
    Message.error(error.Message) // 提示错误信息
  }
  return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
})
function IsCheckTimeOut() {
  const currentTime = Date.now() // 当前时间戳
  const timeStamp = getTimeStamp() // 缓存时间戳
  return (currentTime - timeStamp) / 1000 > TimeOut
}
export default service
