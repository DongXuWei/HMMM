/*
 * @Author: zhanglianchang
 * @Date: 2020-08-01 14:39:32
 * @Last Modified by: taoshiwei
 * @Last Modified time: 2019-04-29 14:53:23
 *
 * 学科有关的接口：自己写吧~~  已经被张老师删了 ^_^
 */
import { createAPI } from '@/utils/request'

// 学科列表
export const getSubjectList = query => createAPI('/subjects', 'get', query)

// 学科添加
export const addSubject = data => createAPI('/subjects', 'post', data)

// 学科详情
export const getDetailSubject = id => createAPI(`/subjects/${id}`, 'get')
// 删除学科
export const delSubject = data => createAPI(`/subjects/${data.id}`, 'delete', data)
