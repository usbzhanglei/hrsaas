// 路由权限文件
// 权限拦截在路由跳转 导航守卫
import router from '@/router'
import store from '@/store' // 引入store实例 和组件中的this.$store是一回事
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式
// 不需要导出 因为只需要让代码执行即可
// 前置守卫
// next是必须执行的钩子 必须执行
// next() 放过
// next(false) 跳转终止
// next(地址) 跳转到某个地址

// 白名单
const whiteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  NProgress.start() // 开启进度条
  if (store.getters.token) {
    // 只有有token的情况下才能获取资料
    // 如果有token
    if (to.path === '/login') {
      // 如果我要访问的是登录页
      next('/') // 跳到主页 // 有 token 用处理吗？ 不用
    } else {
      // 只有放过的时候才去获取资料
      // 不能每次都获取
      // 如果当前vuex中有用户id 表示已经有资料了 不需要获取 如果没有id才需要获取资料
      if (!store.getters.userId) {
        // 如果当前vuex中没有有用户id 需要获取
        // 如果后续 需要根据用户资料获取数据的话 这里必须改成同步
        const { roles } = await store.dispatch('user/getUserInfo')
        // 筛选用户的可以路由
        console.log(roles.menus)
        const routes = await store.dispatch('permission/filterRouters', roles.menus)
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }])
        // 添加完动态路由之后
        // 使用 router.addRoutes() 必须next(地址) 不能用 next()
        next(to.path) // 相当于跳到对应的地址  相当于多做一次跳转 为什么要多做一次跳转
        // 进门了，但是进门之后我要去的地方的路还没有铺好，直接走，掉坑里，多做一次跳转，再从门外往里进一次，跳转之前 把路铺好，再次进来的时候，路就铺好了
      } else {
        next()
      }
    }
  } else {
    // 如果没有token
    if (whiteList.indexOf(to.path) > -1) {
      // 要去的地址在白名单
      next()
    } else {
      next('/login')
    }
  }
  NProgress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})
// 后置守卫
router.afterEach(() => {
  NProgress.done() // 关闭进度条
})
