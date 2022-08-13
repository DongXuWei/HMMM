/*
 * @Author: zhanglianchang
 * @Date: 2020-08-01 14:39:32
 * @Last Modified by: taoshiwei
 * @Last Modified time: 2019-04-29 14:49:44
 *
 * 题库有关的接口：自己写吧~~  已经被张老师删了 ^_^
 */
import { createAPI } from '@/utils/request'

// 获取 题库列表
export const getQuestionsList = (data) => {
  return createAPI('/questions', 'get', data)
}

// 获取学科列表
export const getSubList = () => {
  return createAPI('/subjects/simple', 'get')
}

// 根据选中学科id 获取目录
export const getDirectory = (id) => {
  return createAPI('/directorys/simple', 'get', { subjectID: id })
}

// 获取标签列表
export const getTagsList = () => {
  return createAPI('/tags', 'get')
}

// 获取 用户的简单列表

export const getUserSimpleList = () => {
  return createAPI('/users/simple', 'get')
}

// 获取 精选 题库列表

export const getQuestionsChoiceList = (data) => {
  return createAPI('/questions/choice', 'get', data)
}

// 加入 取消 精选

export const setChoice = (id, choiceState) => {
  return createAPI(`/questions/choice/${id}/${choiceState}`, 'PATCH')
}

// 更改审核 状态

export const editDataCheck = (id, data) => {
  return createAPI(`/questions/check/${id}`, 'POST', data)
}

// 获取 题目详情

export const getQuestionDetail = (id) => {
  return createAPI(`/questions/${id}`, 'get')
}

// 删除 题目详情

export const delQuestions = (id) => {
  return createAPI(`/questions/${id}`, 'DELETE')
}

// 获取题库列表
export const getRandomsList = () => createAPI('/questions/randoms?page=1&pagesize=10', 'GET')

// 上下架 的问题

export const editPublishState = (id, stateNum) => createAPI(`/questions/choice/${id}/${stateNum}`, 'POST')
