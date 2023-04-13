import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
// 状态
const state = {
  // 设置 token 为共享状态 初始化 vuex 的时候 就先从缓存中读取
  token: getToken(), // 设置token为共享状态
  userInfo: {} // 定义一个空对象 因为我们会在**`getters`**中引用userinfo的变量，如果设置为null，则会引起异常和报错
  // 定义一个空的对象 不是null 因为后边我要开发userInfo的属性给别人用  userInfo.name
}
const mutations = {
  setToken(state, token) {
    state.token = token // 将数据设置给token
    // 同步给缓存
    setToken(token)
  },
  removeToken(state) {
    state.token = null // 将vuex数据置空
    removeToken() // 同步到缓存
  },
  setUserInfo(state, result) {
    state.userInfo = result // 是响应式
    // state.userInfo = {...result} // 是响应式 为浅拷贝
  },
  // 删除用户信息
  removeUserToken(state) {
    state.userInfo = {}
  }
}
const actions = {
  async login(context, data) {
    // 调用 api 接口
    const result = await login(data)
    // 表示登录接口调用成功 也就是意味着你的用户名和密码是正确的
    // 现在有用户token
    // actions 修改state 必须通过mutations
    context.commit('setToken', result)
    // 拿到token说明登录成功
    setTimeStamp()
  },
  async getUserInfo(context) {
    const result = await getUserInfo()
    // 获取用户详情 用户的详情数据
    const baseInfo = await getUserDetailById(result.userId)
    context.commit('setUserInfo', { ...result, ...baseInfo }) // 提交到mutations
    return result // 这里为什么要返回 为后面做权限时候埋下伏笔
  },
  // 登出操作
  logout(context) {
    // 删除token
    context.commit('removeToken')
    // 删除用户资料
    context.commit('removeUserToken')
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
