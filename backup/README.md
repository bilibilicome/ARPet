# AR宠物卡通项目

一个完整的Web AR宠物卡通项目，使用原生HTML+CSS+JavaScript开发，基于MindAR实现图像识别和AR效果，兼容移动端浏览器和微信内置浏览器。包含完整的Java后端服务，支持本地调试。

## 项目结构

```
ARPet/
├── index.html              # 首页（上传页面）
├── ar-mindar.html          # MindAR AR扫描页面
├── ar-mindar-simple.html   # MindAR简易测试页面
├── target-generator.html   # MindAR目标生成器
├── css/
│   └── style.css           # 样式文件
├── js/
│   └── main.js             # 首页逻辑
├── assets/                 # 静态资源目录
├── backend/                # Java后端服务
│   ├── pom.xml
│   ├── README.md
│   └── src/main/
│       ├── java/com/arpet/
│       └── resources/
├── MINDAR_SETUP.md         # MindAR配置指南
└── README.md               # 使用说明文档
```

## 功能说明

### 前端
- **首页 (index.html)**: 支持点击上传和拖拽上传宠物照片，调用后端接口生成卡通形象，展示对比图
- **MindAR AR扫描页 (ar-mindar.html)**: 基于MindAR的AR体验，摄像头权限管理、图像识别、2D内容渲染、模型交互控制
- **MindAR简易测试页 (ar-mindar-simple.html)**: 开箱即用的MindAR测试页面，使用官方示例目标
- **目标生成器 (target-generator.html)**: MindAR目标图像生成工具

### 后端
- **上传接口**: 接收图片，生成卡通效果，返回targetId
- **查询接口**: 根据targetId查询卡通资源
- **本地存储**: 图片存储在本地文件系统
- **卡通效果**: 使用色彩量化算法生成卡通效果

## 快速开始

### 1. 启动Java后端服务（必需）

后端服务提供图片上传和卡通生成功能，必须先启动。

**方式一：使用IDE启动（推荐WebStorm/IDEA）**
- 在IDE中打开 `backend` 目录
- 等待Maven依赖下载完成
- 找到 `ArPetApplication.java`
- 右键点击，选择 "Run 'ArPetApplication'"

**方式二：使用Maven命令**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

后端启动成功后，访问 `http://localhost:8080/api/health` 检查服务状态。

详细说明请查看 `backend/README.md`

### 2. 启动前端页面

**使用WebStorm启动**
- 在WebStorm中打开ARPet项目根目录
- 右键点击 `index.html`
- 选择 "Open in Browser" 或 "Run 'index.html'"
- 或使用快捷键 `Alt+Shift+F10` 然后选择浏览器

**其他方式**
- Live Server（VS Code扩展）
- Python HTTP服务器
- Node.js http-server

## 本地调试步骤

1. **使用WebStorm启动**
   - 在WebStorm中打开ARPet项目
   - 右键点击 `index.html` 文件
   - 选择 "Open in Browser" 或 "Run 'index.html'"
   - 或使用快捷键 `Alt+Shift+F10` 然后选择浏览器
   - WebStorm会自动启动本地服务器，默认地址类似 `http://localhost:63342/ARPet/index.html`

2. **访问项目**
   - 确保后端服务已启动（端口8080）
   - 在浏览器中打开对应的前端地址
   - 移动端调试建议使用内网穿透工具（如ngrok）

## 快速体验AR

**无需任何配置，立即体验！**

1. 打开 `ar-mindar-simple.html`
2. 页面会显示一张示例目标图片
3. 用另一台设备打开该图片，或打印出来
4. 将摄像头对准目标图片
5. 🎉 看到AR效果了！

## 配置项替换说明

### 1. 后端接口配置

在 `js/main.js` 中修改：

```javascript
const CONFIG = {
    UPLOAD_API: 'http://localhost:8080/api/upload',  // 替换为实际上传接口
    QUERY_API: 'http://localhost:8080/api/query',    // 替换为实际查询接口
};
```

### 2. MindAR配置（开箱即用）

**详细配置步骤请查看：[MINDAR_SETUP.md](./MINDAR_SETUP.md)**

MindAR是一个开源免费的Web AR引擎，无需注册账号，直接使用！

使用自定义目标：
1. 访问官方编译器：https://hiukim.github.io/mind-ar-js-doc/tools/compile/
2. 上传你的目标图像
3. 下载生成的 `.mind` 文件
4. 修改 `ar-mindar.html` 中的目标文件路径

### 3. 后端接口规范

#### 上传接口
- **URL**: `/api/upload`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **参数**: `file` (图片文件)
- **响应**:
  ```json
  {
    "code": 200,
    "data": {
      "targetId": "target_123456",
      "cartoonUrl": "https://example.com/cartoon.png",
      "resourceType": "image"
    }
  }
  ```

#### 查询接口
- **URL**: `/api/query`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **参数**:
  ```json
  { "targetId": "target_123456" }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "data": {
      "cartoonUrl": "https://example.com/cartoon.png",
      "resourceType": "image"
    }
  }
  ```

## 上线部署要求

### 1. HTTPS要求
- 生产环境必须使用HTTPS
- 摄像头权限在HTTPS环境下才能正常工作

### 2. 服务器配置
- Nginx/Apache配置正确的MIME类型
- 确保支持跨域请求（CORS）
- 配置适当的缓存策略

### 3. 微信内置浏览器
- 确保在微信公众平台配置了JS接口安全域名
- 测试摄像头权限在微信中的表现

## 兼容性注意事项

### 浏览器支持
- ✅ iOS Safari 11+
- ✅ Android Chrome 70+
- ✅ 微信内置浏览器
- ✅ 移动端QQ浏览器
- ❌ 不支持部分老旧浏览器

### 移动端适配
- 页面禁止缩放（已配置viewport）
- 触摸事件优化
- 全屏摄像头显示

### 性能优化
- 页面卸载时自动清理资源
- 模型加载错误降级处理

## 常见问题

### Q: 摄像头无法启动？
A: 确保使用HTTPS协议（localhost除外），检查浏览器权限设置

### Q: 目标无法识别？
A: 确保图像质量足够高，光线充足，避免角度过大

### Q: 微信中无法使用？
A: 确认已配置JS接口安全域名，检查微信版本兼容性

### Q: 如何使用自定义目标图片？
A: 访问MindAR官方编译器生成.mind文件，修改ar-mindar.html中的路径

## 技术栈

- **前端**: 原生HTML5, CSS3, ES6+ JavaScript
- **AR引擎**: MindAR (开源免费)
- **3D/AR框架**: A-Frame
- **后端**: Java Spring Boot
- **零框架依赖**: 可直接在浏览器运行

## 许可证

MIT License
