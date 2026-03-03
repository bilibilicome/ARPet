# AR宠物卡通 - Java后端

本地开发调试用的Java Spring Boot后端服务，支持本地文件存储和卡通效果生成。

## 技术栈

- Java 1.8+
- Spring Boot 2.7.18
- Maven
- 零数据库依赖（使用内存存储）

## 项目结构

```
backend/
├── pom.xml
├── README.md
└── src/
    └── main/
        ├── java/com/arpet/
        │   ├── ArPetApplication.java          # 启动类
        │   ├── config/
        │   │   ├── ArPetConfig.java          # 配置类
        │   │   └── WebConfig.java            # Web配置（CORS、静态资源）
        │   ├── controller/
        │   │   └── ArPetController.java      # REST API控制器
        │   ├── dto/
        │   │   ├── ApiResponse.java           # 通用响应
        │   │   ├── UploadResponse.java        # 上传响应
        │   │   ├── QueryRequest.java          # 查询请求
        │   │   └── QueryResponse.java         # 查询响应
        │   └── service/
        │       ├── FileStorageService.java    # 文件存储服务
        │       └── CartoonService.java        # 卡通效果服务
        └── resources/
            ├── application.yml                 # 配置文件
            └── static/
                ├── uploads/                   # 上传图片存储
                └── cartoons/                  # 卡通图片存储
```

## 快速开始

### 1. 环境要求

- JDK 8 或更高版本
- Maven 3.6+
- IDE（推荐IntelliJ IDEA或Eclipse）

### 2. 使用IDE启动（推荐WebStorm/IDEA）

1. 在IDE中打开 `backend` 目录
2. 等待Maven依赖下载完成
3. 找到 `ArPetApplication.java` 文件
4. 右键点击，选择 "Run 'ArPetApplication'"
5. 看到启动成功日志表示服务已启动

### 3. 使用Maven命令启动

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### 4. 打包后运行

```bash
cd backend
mvn clean package
java -jar target/arpet-backend-1.0.0.jar
```

## 配置说明

配置文件位于 `src/main/resources/application.yml`

```yaml
server:
  port: 8080                    # 服务端口
  servlet:
    context-path: /api           # API前缀

arpet:
  file:
    upload-path: src/main/resources/static/uploads    # 上传文件路径
    cartoon-path: src/main/resources/static/cartoons  # 卡通文件路径
  server:
    base-url: http://localhost:8080/api              # 服务器基础URL
```

## API接口说明

### 1. 上传接口

- **URL**: `POST /api/upload`
- **Content-Type**: `multipart/form-data`
- **参数**:
  - `file`: 图片文件（jpg/png）
- **响应**:
  ```json
  {
    "code": 200,
    "message": "上传成功",
    "data": {
      "targetId": "target_abc123def456",
      "cartoonUrl": "http://localhost:8080/api/cartoons/xxx.png",
      "resourceType": "image"
    }
  }
  ```

### 2. 查询接口

- **URL**: `POST /api/query`
- **Content-Type**: `application/json`
- **参数**:
  ```json
  { "targetId": "target_abc123def456" }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "cartoonUrl": "http://localhost:8080/api/cartoons/xxx.png",
      "resourceType": "image"
    }
  }
  ```

### 3. 健康检查

- **URL**: `GET /api/health`
- **响应**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": "服务运行正常"
  }
  ```

## 功能说明

### 文件存储
- 上传的图片存储在 `src/main/resources/static/uploads`
- 生成的卡通图片存储在 `src/main/resources/static/cartoons`
- 通过静态资源映射可直接访问

### 卡通效果
- 使用简单的色彩量化算法生成卡通效果
- 如果效果生成失败，会直接返回原图

### Target ID生成
- 使用UUID生成唯一的targetId
- 内存中维护targetId与卡通图片的映射关系

## 本地调试流程

1. **启动后端服务**
   - 按照上面的方法启动Spring Boot应用

2. **启动前端页面**
   - 在WebStorm中打开项目根目录
   - 右键点击 `index.html`，选择 "Open in Browser"

3. **测试上传功能**
   - 在首页选择一张宠物照片
   - 点击"生成卡通形象"
   - 查看生成的卡通效果图

4. **测试查询功能**
   - 点击"进入AR体验"
   - 会自动调用查询接口获取卡通资源

## 注意事项

1. **内存存储**: targetId映射存储在内存中，服务重启后会丢失
2. **文件路径**: 确保文件存储目录有写入权限
3. **跨域配置**: 已配置CORS允许所有来源，生产环境请修改
4. **端口占用**: 确保8080端口未被占用，可在配置文件中修改

## 扩展开发

### 接入真实Vuforia API

修改 `FileStorageService.java`，添加真实的Vuforia Target生成逻辑：

```java
// 调用Vuforia Web Service API生成Target
// 参考: https://developer.vuforia.com/library/web-api
```

### 接入真实卡通生成API

修改 `CartoonService.java`，调用第三方AI卡通化API：

```java
// 调用图像卡通化API
// 例如：百度AI、腾讯AI等
```

### 添加数据库支持

当前使用内存存储，可添加Redis/MySQL持久化targetId映射。

## 常见问题

**Q: Maven依赖下载慢？**  
A: 配置阿里云Maven镜像

**Q: 端口8080被占用？**  
A: 修改application.yml中的端口号

**Q: 图片无法访问？**  
A: 检查文件路径配置和静态资源映射

**Q: 前端请求跨域？**  
A: 已配置CORS，检查WebConfig.java

## 许可证

MIT License
