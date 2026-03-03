# 部署到 GitHub Pages 指南

## 📌 重要说明

**当前版本无需后端！**
- 卡通形象生成使用 Canvas 在前端本地完成
- 所有功能都是纯前端代码（HTML/CSS/JS
- 可以直接部署到 GitHub Pages

## 前置条件
- 你需要有一个 GitHub 账号
- 你需要安装 Git

## 步骤 1：创建 GitHub 仓库

1. 访问 https://github.com 并登录
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 输入仓库名称（例如：`arpet`）
4. 选择 "Public" 或 "Private"
5. **不要**勾选 "Initialize this repository with a README"
6. 点击 "Create repository"

## 步骤 2：初始化 Git 仓库

在项目根目录（`e:\Projects\TraeProjects\ARPet`）打开终端，执行以下命令：

```bash
# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit"

# 添加远程仓库（替换 YOUR_USERNAME 和 REPO_NAME）
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

**注意**：请将 `YOUR_USERNAME` 替换为你的 GitHub 用户名，`REPO_NAME` 替换为你的仓库名称。

## 步骤 3：启用 GitHub Pages

1. 在 GitHub 上打开你的仓库
2. 点击 "Settings"（设置）
3. 在左侧菜单中找到 "Pages"（页面）
4. 在 "Build and deployment" 部分：
   - "Source" 选择 "Deploy from a branch"
   - "Branch" 选择 `main` 分支
   - 文件夹选择 `/ (root)`
5. 点击 "Save"

## 步骤 4：等待部署完成

- GitHub Pages 需要 1-5 分钟来部署
- 部署完成后，你会在 Pages 页面看到类似这样的链接：
  `https://YOUR_USERNAME.github.io/REPO_NAME/`

## 步骤 5：访问你的网站

使用上面的链接在手机浏览器中访问，现在就可以正常使用摄像头和AR功能了！

## 常见问题

### Q: 为什么需要 GitHub Pages？
A: 手机浏览器需要 HTTPS 环境才能访问摄像头，GitHub Pages 提供免费的 HTTPS 服务。

### Q: 部署后多久可以访问？
A: 通常 1-5 分钟，刷新几次 Pages 页面查看状态。

### Q: 如何更新网站？
A: 修改代码后，执行：
```bash
git add .
git commit -m "Update"
git push
```
GitHub Pages 会自动重新部署。

### Q: 后端代码呢？
A: 当前版本不需要后端，`backend/` 文件夹已被保留在本地，但不会被 `.gitignore` 配置为不提交到 GitHub。
   如需恢复后端功能，只需取消注释相关代码即可。

### Q: 如何使用 AR.js 需要什么标记？
A: 使用 Hiro 标记，可以在这里获取：https://jeromeetienne.github.io/AR.js/data/images/HIRO.jpg
