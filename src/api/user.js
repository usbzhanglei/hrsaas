import request from '@/utils/request'

/**
 * 登录接口
 * @param {*} data
 * @returns promise
 */
export function login(data) {
  // 返回一个 promise 对象
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

/**
 * 获取用户资料
 */
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}
/**
 * 获取用户基本信息 完全为了获取头像
 */
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

export function logout() {

}
