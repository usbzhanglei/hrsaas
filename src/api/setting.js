import request from '@/utils/request'
/**
 * 获取所有角色列表
 */
export function getRoleList(params) {
  return request({
    url: '/sys/role',
    method: 'get',
    params
  })
}
/**
 * 根据id获取企业信息
 */
export function getCompanyInfo(id) {
  return request({
    url: `/company/${id}`,
    method: 'get'
  })
}
/** *
 * 删除角色
 */
export function deleteRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}
/** *
 * 修改角色
 * ***/
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    data,
    method: 'put'
  })
}
/**
 * 获取角色详情
 * **/
export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`
  })
}

/** *
 * 新增角色
 * ***/
export function addRole(data) {
  return request({
    url: '/sys/role',
    data,
    method: 'post'
  })
}
