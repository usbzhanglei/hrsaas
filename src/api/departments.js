import request from '@/utils/request'
/** *
 * 获取企业的部门列表
 */
export function getDepartment() {
  return request({
    url: '/company/department'
  })
}
/**
 * 根据ID删除部门
 * 接口是根据restful的规则设计的   删除 delete  新增 post  修改put 获取 get
 * 相同的地址 不同的方法 执行不同的业务
 */
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}
/**
 * 新增部门
 */
export function addDepartments(data) {
  return request({
    url: `/company/department`,
    method: 'post',
    data
  })
}
/** *
 * 获取某个部门详情
 */
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'get'
  })
}
/** *
 * 编辑部门
 */
export function updateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}
