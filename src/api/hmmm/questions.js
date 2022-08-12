/*
 * @Author: zhanglianchang
 * @Date: 2020-08-01 14:39:32
 * @Last Modified by: taoshiwei
 * @Last Modified time: 2019-04-29 14:49:44
 *
 * 题库有关的接口：自己写吧~~  已经被张老师删了 ^_^
 */

import { createAPI } from '@/utils/request.js'
// 获取题库列表
export const getRandomsList = (page) => createAPI(`/questions/randoms?page=${page.page}&pagesize=${page.pagesize}`, 'GET')

// 删除题库列表
export const delRandomsById = (id) => createAPI(`/questions/randoms/${id}`, 'DELETE')
