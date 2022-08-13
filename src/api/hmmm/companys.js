/*
 * @Author: zhanglianchang
 * @Date: 2020-08-01 14:39:32
 * @Last Modified by: taoshiwei
 * @Last Modified time: 2019-04-29 14:32:40
 *
 * 企业管理
 */

import { createAPI } from '@/utils/request'

// 获取企业
export const getCompanyListAPI = (data) => createAPI('/companys', 'get', data)
// 添加企业
export const addCompanyAPI = data => createAPI('/companys', 'POST', data)
// 根据id查询企业详情
export const getCompanyDetailAPI = id => createAPI(`/companys/${id}`, 'GET')
// 根据id修改企业详情
export const updateCompanyDetailAPI = data => createAPI(`/companys/${data.id}`, 'PUT', data)
// 更改状态的接口
export const updateCompanyState = data => createAPI(`/companys/${data.id}/${data.state}`, 'POST')
// 删除
export const delCompanyByIDAPI = id => createAPI(`/companys/${id}`, 'DELETE')

export const add = data => createAPI('/comapnys', 'post', data)
export const update = data =>
  createAPI(`/comapnys/${data.userId}`, 'get', data)
export const remove = data => createAPI(`/comapnys/${data.id}`, 'get')
export const detail = data =>
  createAPI(`/comapnys/${data.userId}`, 'post', data)
export const disabled = data => createAPI('/comapnys/state', 'post', data)
