/// <reference types="vite/client" />

/**
 * Vue组件类型声明
 * 使TypeScript能够正确识别.vue文件
 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

/**
 * 扩展Window接口
 * 添加A-Frame和Three.js的类型声明
 */
interface Window {
  AFRAME: any
  THREE: any
  arjs: any
}
