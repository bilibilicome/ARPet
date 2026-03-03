/**
 * AR宠物卡通 - 应用入口文件
 * 使用Vue3 + TypeScript + Vue Router构建
 */
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import ARView from './views/ARView.vue'

/**
 * 创建路由配置
 * 定义应用的路由规则
 */
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/ar', name: 'AR', component: ARView }
  ]
})

/**
 * 创建并挂载Vue应用
 */
const app = createApp(App)
app.use(router)
app.mount('#app')
