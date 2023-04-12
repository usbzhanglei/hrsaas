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

export function getInfo(token) {

}

export function logout() {

}
