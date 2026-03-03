# 部署指南

本指南将帮助你将AR宠物卡通项目部署到各种平台。

## 📌 前置条件

- Node.js 16+ 已安装
- npm 或 yarn 包管理器
- Git（可选，用于版本控制）

## 🚀 快速部署

### 方式一：GitHub Pages（推荐，免费）

GitHub Pages提供免费的HTTPS托管，非常适合这个项目。

#### 步骤 1：构建项目

```bash
npm run build
```

构建完成后，会在项目根目录生成 `dist` 文件夹。

#### 步骤 2：创建GitHub仓库

1. 访问 https://github.com 并登录
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 输入仓库名称（例如：`arpet`）
4. 选择 "Public" 或 "Private"
5. **不要**勾选 "Initialize this repository with a README"
6. 点击 "Create repository"

#### 步骤 3：初始化Git并推送

在项目根目录打开终端，执行以下命令：

```bash
# 初始化Git仓库（如果还没有）
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit"

# 添加远程仓库（替换 YOUR_USERNAME 和 REPO_NAME）
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 推送到GitHub
git branch -M main
git push -u origin main
```

#### 步骤 4：配置GitHub Pages

1. 在GitHub上打开你的仓库
2. 点击 "Settings"（设置）
3. 在左侧菜单中找到 "Pages"（页面）
4. 在 "Build and deployment" 部分：
   - "Source" 选择 "Deploy from a branch"
   - "Branch" 选择 `main` 分支
   - 文件夹选择 `/ (root)`
5. 点击 "Save"

**注意**：由于我们的项目需要构建，建议使用GitHub Actions自动构建。

#### 步骤 5：使用GitHub Actions自动构建（推荐）

在项目根目录创建 `.github/workflows/deploy.yml` 文件：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

然后在GitHub Pages设置中：
- "Source" 选择 "Deploy from a branch"
- "Branch" 选择 `gh-pages` 分支
- 文件夹选择 `/ (root)`

#### 步骤 6：访问你的网站

部署完成后，访问：`https://YOUR_USERNAME.github.io/REPO_NAME/`

---

### 方式二：Vercel（最简单，免费）

Vercel提供零配置部署，支持Vue项目。

#### 步骤：

1. 访问 https://vercel.com 并登录
2. 点击 "New Project"
3. 导入你的GitHub仓库
4. 配置项目设置（默认即可）
5. 点击 "Deploy"

几分钟后，你的项目就部署好了！

---

### 方式三：Netlify（简单，免费）

Netlify同样提供简单的部署体验。

#### 步骤：

1. 访问 https://netlify.com 并登录
2. 点击 "Add new site" → "Import an existing project"
3. 连接到GitHub
4. 选择你的仓库
5. 配置构建命令：`npm run build`
6. 配置发布目录：`dist`
7. 点击 "Deploy site"

---

### 方式四：自建服务器（Nginx）

如果你有自己的服务器，可以使用Nginx部署。

#### 步骤 1：构建项目

```bash
npm run build
```

#### 步骤 2：上传dist文件夹到服务器

使用SCP或其他工具将 `dist` 文件夹上传到服务器。

#### 步骤 3：配置Nginx

创建Nginx配置文件 `/etc/nginx/sites-available/arpet`：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 启用Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
}
```

#### 步骤 4：启用站点并重启Nginx

```bash
sudo ln -s /etc/nginx/sites-available/arpet /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 步骤 5：配置HTTPS（推荐）

使用Let's Encrypt免费证书：

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## ⚠️ 重要注意事项

### 1. HTTPS要求

- 生产环境必须使用HTTPS
- 摄像头权限在HTTPS环境下才能正常工作
- localhost除外（开发环境可以使用HTTP）

### 2. 路由配置

项目使用Vue Router的history模式，部署时需要确保：
- 服务器配置支持单页应用（SPA）
- 所有路由都指向index.html

### 3. 资源路径

确保构建后的资源路径正确。Vite默认使用相对路径，通常不需要额外配置。

### 4. CORS配置

如果从其他域名加载资源，确保CORS配置正确。

---

## 🔧 部署后检查清单

- [ ] 网站可以正常访问
- [ ] HTTPS证书有效
- [ ] 所有页面路由正常
- [ ] 图片资源加载正常
- [ ] 摄像头权限可以正常申请
- [ ] AR功能可以正常使用
- [ ] 手机端访问正常
- [ ] 微信浏览器访问正常

---

## ❓ 常见问题

### Q: 部署后页面空白？
A: 检查浏览器控制台错误，确保资源路径正确。

### Q: 路由刷新404？
A: 确保服务器配置了SPA fallback，所有路由指向index.html。

### Q: 摄像头无法使用？
A: 确保使用HTTPS协议（localhost除外）。

### Q: 如何更新部署？
A: 提交代码到GitHub，平台会自动重新部署。

### Q: 部署后如何修改配置？
A: 修改代码后重新构建并部署。

---

## 📚 更多资源

- [Vite部署文档](https://cn.vitejs.dev/guide/build.html)
- [Vue Router部署指南](https://router.vuejs.org/zh/guide/essentials/history-mode.html)
- [GitHub Pages文档](https://docs.github.com/cn/pages)
- [Vercel文档](https://vercel.com/docs)
- [Netlify文档](https://docs.netlify.com)
