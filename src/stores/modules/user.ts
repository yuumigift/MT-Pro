// 用户相关的小仓库
import { defineStore } from 'pinia'
import type { LoginFrom } from '@/api/user/type'
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
import type { UserState } from '@/stores/modules/types/type'
import { routers } from '@/router/router'

const useUserStore = defineStore('User', {
  // 小仓库存储数据的地方
  state: (): UserState => {
    return {
      token: localStorage.getItem('TOKEN'), // 用户唯一标识
      menuRouters: routers, // 仓库存储生成菜单
      username: null,
      avatar: null
    }
  },
  // 处理异步跟逻辑的地方
  actions: {
    // async 会返回函数执行的结果
    async userLogin(data: LoginFrom) {
      console.log('触发小仓库登录方法', data)
      const result = await reqLogin(data)
      console.log('去请求登录了', result)
      // 返回200，存储token
      // 失败401，登录失败错误信息
      if (result.code == 200) {
        this.token = result.data
        // 本地存储持久化
        localStorage.setItem('TOKEN', result.data)
        // 保证当前async函数返回一个成功的promise
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    // 获取用户信息
    async userInfo() {
      // 获取用户信息存储当前用户的头像，名称
      const result = await reqUserInfo()
      console.log(result)
      if (result.code == 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    // 退出登录
    async userLogout() {
      const result = await reqLogout()
      console.log(result)

      if (result.code == 200) {
        // 清除用户所有的信息
        this.username = null
        this.avatar = null
        this.token = null
        localStorage.removeItem('TOKEN')
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    }
  },
  // 处理计算属性
  getters: {}
})

// 对外暴露获取小仓库的方法
export default useUserStore
