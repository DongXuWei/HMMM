import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import Layout from '@/module-dashboard/pages/layout'
import { getToken } from '@/utils/auth'

// 导入动态路由
// import heimamianmian from '@/module-hmmm/router'
// console.log(...heimamianmian)

// 定义
const _import = require('./import_' + process.env.NODE_ENV) // 懒加载 导包
const whiteList = ['/login', '/authredirect'] // 白名单 无需跳转

// 配置
Vue.use(Router)
NProgress.configure({ showSpinner: false }) // NProgress Configuration

/**
 * 基础路由
 *
* hidden: true                   如果' hidden:true '不会显示在侧边栏中(默认为false)
* alwaysShow: true               如果设置为true，将总是显示根菜单，不管它的子路由长度是多少
*                                如果没有设置alwaysShow，子路由下只能有一个以上的路由
*                                它将变成嵌套模式，否则不显示根菜单
* redirect: noredirect           如果' redirect:noredirect '在breadcrumb中没有重定向
* name:'router-name'             该名称由<keep-alive>使用(必须设置!!)
* meta : {
    roles: ['admin','editor']    将控制页面角色(您可以设置多个角色)
    title: 'title'               在子菜单和面包屑中显示的名称(建议设置)
    icon: 'svg-name'             图标显示在侧边栏，
    noCache: true                如果为true，页面将不会被缓存(默认为false)
  }
**/
// 静态路由  所有用户都可以进行访问的界面
export const constantRouterMap = [
  {
    // 登录
    path: '/login',
    component: _import('dashboard/pages/login'),
    hidden: true
  },
  {
    path: '/authredirect',
    component: _import('dashboard/pages/authredirect'),
    hidden: true
  },
  { path: '/404', component: _import('dashboard/pages/404'), hidden: true },
  { path: '/401', component: _import('dashboard/pages/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: _import('dashboard/pages/dashboard'),
        name: 'dashboard',
        meta: { title: '面板', icon: 'dashboard', noCache: true }
      }
    ]
  }
]

// 定义一个动态路由变量
// 导出变量 后面做权限的时候会用到
export const asyncRouters = [
  // heimamianmian
]

/**
 * 配置路由
 **/

// const routerAll = [...asyncRouters, ...constantRouterMap]
const router = new Router({
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),

  // 循环的路由表
  // routes: routerAll
  routes: constantRouterMap
})
console.log(...constantRouterMap)

// 路由前置守卫
router.beforeEach((to, from, next) => {
  NProgress.start() // 开启进度条
  if (getToken()) {
    // determine if there has token
    /* has token */
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // 关闭进度条
    } else {
      if (store.getters.roles.length === 0) {
        // 判断当前用户是否已拉取完user_info信息
        store
          .dispatch('GetUserInfo')
          .then(res => {
            // 拉取user_info
            const roles = res.data.roles // note: 角色必须是一个数组! 如:['编辑','发展']
            store.dispatch('GenerateRoutes', { roles }).then(() => {
              // 根据roles权限生成可访问的路由表
              router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
              next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,设置replace: true，这样导航将不会留下历史记录
            })
          })
          .catch(() => {
            store.dispatch('FedLogOut').then(() => {
              Message.error('验证失败, 请重新登录')
              next({ path: '/login' })
            })
          })
      } else {
        next()
      }
    }
  } else {
    /* has no token */
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done() // 如果当前页面是登录，将不会触发后，每个钩子，所以手动处理它
    }
  }
})

// 后置路由守卫
router.afterEach(() => {
  NProgress.done() // 关闭进度条 finish progress bar
})

/**
 * 导出 基础路由
 **/
export default router

/**
 * 导出 业务路由
 **/
export const asyncRouterMap = [{ path: '*', redirect: '/404', hidden: true }]
