# AR宠物卡通

一个完整的Web AR宠物卡通项目，使用Vue3 + TypeScript + Vite开发，基于AR.js实现图像识别和AR效果，兼容移动端浏览器和微信内置浏览器。所有功能在前端本地完成，无需后端！

## ✨ 功能特性

- 📸 **照片上传** - 支持点击和拖拽上传宠物照片
- 🎨 **背景移除** - 智能移除照片背景
- 🐾 **卡通效果** - 将照片转换为卡通风格
- 🖼️ **矢量化** - 生成SVG矢量卡通形象
- 🎯 **AR体验** - 基于AR.js的增强现实效果
- 🌱 **3D场景** - 包含草地、花草、树木等立体元素
- 📱 **移动端优化** - 完美适配手机和微信浏览器

## 🛠️ 技术栈

- **前端框架**: Vue 3 (Composition API)
- **类型系统**: TypeScript
- **构建工具**: Vite
- **路由管理**: Vue Router
- **AR引擎**: AR.js + A-Frame
- **3D渲染**: Three.js
- **图像处理**: Canvas API

## 📁 项目结构

```
ARPet/
├── src/
│   ├── composables/
│   │   └── useImageProcessor.ts    # 图片处理Composable
│   ├── types/
│   │   └── index.ts                  # TypeScript类型定义
│   ├── views/
│   │   ├── Home.vue                  # 首页（上传处理页面）
│   │   └── ARView.vue                # AR体验页面
│   ├── App.vue                       # 根组件
│   ├── main.ts                       # 入口文件
│   └── vite-env.d.ts                 # Vite环境类型
├── index.html                        # HTML入口
├── vite.config.ts                    # Vite配置
├── tsconfig.json                     # TypeScript配置
├── package.json                      # 项目依赖
└── DEPLOY.md                         # 部署指南
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 访问应用

- **电脑访问**: http://localhost:5173/
- **手机访问**: http://你的电脑IP:5173/（需要同一WiFi）

## 📱 使用说明

### 完整流程

1. **上传照片** - 点击或拖拽上传宠物照片
2. **移除背景** - 自动移除照片背景
3. **卡通化** - 生成卡通风格效果
4. **矢量化** - 转换为SVG矢量格式
5. **开始AR** - 进入AR体验页面

### AR使用

1. 下载并打印Hiro标记: https://jeromeetienne.github.io/AR.js/data/images/HIRO.jpg
2. 将摄像头对准Hiro标记
3. 观看3D场景和卡通形象出现！

## 🎯 Hiro标记

AR.js使用Hiro标记进行图像识别：

- **标记下载**: https://jeromeetienne.github.io/AR.js/data/images/HIRO.jpg
- **使用方法**: 打印标记或在另一台设备上显示
- **识别效果**: 将摄像头对准标记即可看到AR效果

## 📦 构建部署

### 开发模式

```bash
npm run dev
```

### 生产构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

详细部署说明请查看 [DEPLOY.md](./DEPLOY.md)

## 🔧 配置说明

### Vite配置

修改 `vite.config.ts` 可以调整：
- 开发服务器端口
- 主机地址（默认 `0.0.0.0` 允许局域网访问）
- 代理设置等

### 类型声明

TypeScript类型定义在 `src/types/index.ts` 中。

## 📱 浏览器兼容性

- ✅ iOS Safari 11+
- ✅ Android Chrome 70+
- ✅ 微信内置浏览器
- ✅ 移动端QQ浏览器

## ⚠️ 注意事项

1. **HTTPS要求**: 生产环境必须使用HTTPS（摄像头权限需要）
2. **摄像头权限**: 首次使用需要授权摄像头访问
3. **光线条件**: AR识别需要充足的光线
4. **标记质量**: 确保Hiro标记清晰可见

## ❓ 常见问题

### Q: 摄像头无法启动？
A: 确保使用HTTPS协议（localhost除外），检查浏览器权限设置。

### Q: 手机无法访问？
A: 确保手机和电脑在同一WiFi，使用电脑的局域网IP访问。

### Q: AR识别不灵敏？
A: 确保光线充足，标记清晰，摄像头正对标记。

### Q: 如何部署到生产环境？
A: 查看 [DEPLOY.md](./DEPLOY.md) 了解详细部署步骤。

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！
