import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/**
 * Vite配置文件
 * 配置Vue插件和开发服务器
 */
export default defineConfig({
  // Vue插件
  plugins: [vue()],
  // 开发服务器配置
  server: {
    // 监听所有网络接口，允许局域网访问
    host: '0.0.0.0',
    // 端口号
    port: 5173
  }
})
