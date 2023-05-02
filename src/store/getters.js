const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token, // 在根级的getters上 开发子模块的属性给别人看 给别人用
  name: state => state.user.userInfo.username, // 建立用户名称的映射
  userId: state => state.user.userInfo.userId, // 建立用户名称的映射
  staffPhoto: state => state.user.userInfo.staffPhoto, // 建立头像的映射
  companyId: state => state.user.userInfo.companyId, // 建立公司id的映射
  routes: state => state.permission.routers
}
export default getters
