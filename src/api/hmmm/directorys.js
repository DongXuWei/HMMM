/*
 * @Author: zhanglianchang
 * @Date: 2020-08-01 14:39:32
 * @Last Modified by: taoshiwei
 * @Last Modified time: 2019-04-29 14:56:00
 *
 * 目录
 */

// import createAPI from '@/utils/request'

// // 目录列表
// export const list = data => createAPI('/direcotrys', 'get', data)

// // 目录简单列表
// export const simple = data => createAPI('/direcotrys', 'post')
// 目录列表
import { createAPI } from '@/utils/request'
export const list = data => createAPI('/direcotrys', 'get', data)

// 目录列表
export const getContentList = data => createAPI('/directorys', 'get', data)

// 目录简单列表
export const simple = data => createAPI('/direcotrys', 'post')

// 目录简单列表
export const directorysSimple = subjectID => createAPI(`/tags/simple?subjectID=${subjectID}`, 'GET')

// 目录详情
export const getContentDetail = id =>
  createAPI(`/directorys/${id}`, 'get')

// 目录添加
export const addContent = data => createAPI('/directorys', 'post', data)

// 目录修改
export const updateContent = data => createAPI(`/directorys/${data.id}`, 'put', data)

// 目录删除
export const removeContent = data =>
  createAPI(`/directorys/${data.id}`, 'delete', data)

// 目录状态
export const changeState = data => createAPI(`/directorys/${data.id}/${data.state}`, 'post', data)
