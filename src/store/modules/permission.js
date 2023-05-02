// 处理权限路由
import { constantRoutes, asyncRoutes } from '@/router'
const state = {
  // 一开始拥有静态路由的权限
  routers: constantRoutes // 路由表 表示当前用户拥有的所有路由的数组
}
const mutations = {
  // 修改routers
  setRouters(state, newRouter) {
    // 不正确
    // state.routers = [...state.routers, ...newRouter]
    state.routers = [...constantRoutes, ...newRouter] // 每次都是在静态路由的基础上加新的路由
  }
}
const actions = {
  // 筛选权限路由
  filterRouters(context, menus) {
    const routes = []
    menus.forEach(key => {
      routes.push(...asyncRoutes.filter(item => item.name === key))
    })
    context.commit('setRouters', routes)
    return routes
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
