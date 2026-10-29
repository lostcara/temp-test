# 使用指南

## 📦 使用模板项目创建新项目

### 方法一：克隆模板项目

```bash
# 克隆项目
git clone <your-template-repo-url> my-new-project
cd my-new-project

# 删除模板的 Git 历史（如果需要）
rm -rf .git

# 初始化新的 Git 仓库
git init
git add .
git commit -m "Initial commit"

# 安装依赖
npm install
```

### 方法二：使用模板工具

如果你使用 GitHub Template 或其他模板工具，可以直接从模板创建新项目。

## ⚙️ 配置新项目

### 1. 修改项目名称

更新 `package.json`:

```json
{
  "name": "your-project-name",
  "description": "Your project description"
}
```

更新 `ecosystem.config.js`:

```javascript
{
  name: "your-project-name",
  // ...
}
```

### 2. 配置数据库连接

复制并编辑 `.env.example`:

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置你的 MongoDB 连接信息：

```env
# 本地开发配置示例
MONGODB_HOST=127.0.0.1
MONGODB_PORT=27017
MONGODB_DATABASE=my_database
MONGODB_ENABLE_AUTH=false

# 使用认证的配置示例
MONGODB_HOST=your-mongodb-host.com
MONGODB_PORT=27017
MONGODB_DATABASE=my_database
MONGODB_ENABLE_AUTH=true
MONGODB_USER=my_username
MONGODB_PASSWORD=my_password
```

### 3. 更新 PM2 配置

编辑 `ecosystem.config.js`，修改应用名称和环境变量：

```javascript
module.exports = {
  apps: [
    {
      name: "your-project-name",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        MONGODB_HOST: "localhost",
        MONGODB_PORT: "27017",
        MONGODB_DATABASE: "your_database",
        // ... 你的配置
      },
    },
  ],
};
```

## 🎯 添加你的业务逻辑

### 📖 使用示例代码

项目提供了完整的示例代码，帮助你快速创建自己的模型和路由：

- **示例模型**: `models/ExampleModel.ts` - 包含各种字段类型和验证规则
- **示例路由**: `routes/exampleRoute.ts` - 包含完整的 CRUD 操作

**详细示例和教程**: 查看 [EXAMPLES.md](EXAMPLES.md)

### 快速创建模型和路由

1. **复制示例文件**:

```bash
# 复制示例模型
cp models/ExampleModel.ts models/YourModel.ts

# 复制示例路由
cp routes/exampleRoute.ts routes/yourRoute.ts
```

2. **修改模型和路由**:

   - 根据 `EXAMPLES.md` 中的指导修改代码
   - 参考用户管理系统的完整示例

3. **注册路由**:

```typescript
import yourRouter from "./routes/yourRoute";

app.use("/api/your-resource", yourRouter);
```

完整的示例代码和最佳实践请参考 [EXAMPLES.md](EXAMPLES.md)

## 🧪 运行项目

### 开发模式

```bash
npm run dev
```

### 生产模式

```bash
# 构建项目
npm run build

# 启动服务器
npm start
```

### 使用 PM2

```bash
# 启动
npm run pm2:start

# 查看状态
npm run pm2:status

# 查看日志
npm run pm2:logs

# 重启
npm run pm2:restart

# 停止
npm run pm2:stop
```

## 🐳 Docker 部署

### 构建和运行

```bash
# 构建项目
npm run build

# 构建 Docker 镜像
docker build -t your-project-name .

# 运行容器
docker run -p 3000:3000 --env-file .env your-project-name
```

### 使用 Docker Compose

```bash
# 启动所有服务（包括 MongoDB）
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 停止并删除数据卷
docker-compose down -v
```

## 📝 最佳实践

### 1. 环境变量管理

- 永远不要将 `.env` 文件提交到 Git
- 为每个环境（开发、测试、生产）创建单独的 `.env` 文件
- 使用环境变量管理敏感信息

### 2. 错误处理

在路由中添加统一的错误处理：

```typescript
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};
```

### 3. 请求验证

使用中间件验证请求数据：

```typescript
import { Request, Response, NextFunction } from "express";

export const validateProduct = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: "Name and price are required" });
  }

  if (typeof price !== "number" || price <= 0) {
    return res.status(400).json({ message: "Price must be a positive number" });
  }

  next();
};
```

### 4. 日志记录

在生产环境中使用专业的日志库：

```bash
npm install winston
```

```typescript
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}
```

## 🔍 故障排查

### MongoDB 连接问题

1. 检查 MongoDB 服务是否运行：

```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl status mongod
```

2. 检查连接字符串格式是否正确
3. 检查防火墙和网络设置
4. 查看应用日志了解详细错误信息

### 端口被占用

```bash
# Windows - 查找占用端口的进程
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000
```

### PM2 问题

```bash
# 重置 PM2
pm2 kill
pm2 resurrect

# 查看详细信息
pm2 describe your-app-name
```

## 📚 扩展阅读

- [Express.js 官方文档](https://expressjs.com/)
- [Mongoose 官方文档](https://mongoosejs.com/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [PM2 官方文档](https://pm2.keymetrics.io/)
- [Docker 官方文档](https://docs.docker.com/)

## 🤝 获取帮助

如果遇到问题，请：

1. 查看项目 README.md
2. 检查 GitHub Issues
3. 提交新的 Issue 描述问题
