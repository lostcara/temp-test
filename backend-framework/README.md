# MongoDB + Express + TypeScript 后端模板

这是一个基于 Express、TypeScript 和 MongoDB 的后端项目模板，提供了完整的数据库连接管理、API 路由和部署配置。

> 🚀 **[快速入门](docs/QUICKSTART.md)** | 📖 [完整文档](README.md) | ⚙️ [配置说明](docs/CONFIG.md) | 🔧 [使用指南](docs/USAGE.md) | 💡 [示例代码](docs/EXAMPLES.md)

## ✨ 特性

- 🚀 **Express.js** - 高性能的 Node.js Web 框架
- 📘 **TypeScript** - 类型安全的 JavaScript
- 🍃 **MongoDB** - NoSQL 数据库
- 🔐 **配置灵活** - 通过环境变量轻松配置数据库连接
- 💪 **自动重连** - 内置数据库连接池和自动重连机制
- 🛡️ **安全中间件** - CORS、安全响应头等
- 📊 **健康检查** - 内置数据库和服务器健康检查
- 🎯 **PM2 支持** - 生产环境进程管理
- 🐳 **容器化部署** - 支持 Docker 部署

## 📋 目录结构

```
backend-framework/
├── models/              # Mongoose 数据模型
├── routes/              # Express 路由
├── utils/               # 工具函数（数据库管理）
├── index.ts             # 应用入口
├── tsconfig.json        # TypeScript 配置
├── package.json         # 项目依赖
├── ecosystem.config.js  # PM2 配置
├── Dockerfile           # Docker 镜像配置
├── docker-compose.yml   # Docker Compose 配置
├── deploy.sh            # 部署脚本
├── .env.example         # 环境变量示例
├── .gitignore           # Git 忽略文件
├── .dockerignore        # Docker 忽略文件
├── README.md            # 项目文档（本文档）
├── docs/                # 文档目录
│   ├── QUICKSTART.md        # 快速入门指南
│   ├── CONFIG.md            # 配置说明
│   ├── USAGE.md             # 使用指南
│   ├── EXAMPLES.md          # 示例代码使用指南
│   ├── CONNECTION_DIAGNOSIS.md  # 连接诊断
│   ├── MONGODB_OPTIMIZATION.md  # MongoDB 优化
│   ├── TEST_REPORT.md       # 测试报告
│   ├── TEMPLATE_SUMMARY.md  # 模板总结
│   └── CHANGELOG.md         # 更新日志
```

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd backend-framework
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env` 并修改配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 服务器配置
PORT=3000
NODE_ENV=development

# MongoDB 配置
MONGODB_HOST=127.0.0.1
MONGODB_PORT=27017
MONGODB_DATABASE=your_database_name

# MongoDB 认证配置（可选）
MONGODB_ENABLE_AUTH=false
MONGODB_USER=your_username
MONGODB_PASSWORD=your_password
```

### 4. 启动开发服务器

```bash
npm run dev
```

服务器将在 `http://localhost:3000` 启动。

## 📚 文档

项目提供了完整的文档系统，位于 `docs/` 目录下：

- **[📖 文档导航](docs/README.md)** - 完整的文档索引和推荐阅读顺序
- **[🚀 快速入门](docs/QUICKSTART.md)** - 5 分钟快速启动指南
- **[🔐 认证系统指南](docs/AUTH_GUIDE.md)** - 用户认证和权限管理系统 🆕
- **[💡 示例代码](docs/EXAMPLES.md)** - 完整的模型和路由示例
- **[⚙️ 配置说明](docs/CONFIG.md)** - 详细的配置选项说明

更多文档请查看 [docs 目录](docs/) 或 [文档导航](docs/README.md)。

💡 **不熟悉项目结构？** 查看 [项目结构说明](PROJECT_STRUCTURE.md) 了解每个文件的作用。

## 📝 环境变量说明

| 变量名                | 必填 | 默认值          | 说明                             |
| --------------------- | ---- | --------------- | -------------------------------- |
| `PORT`                | 否   | `3000`          | 服务器端口                       |
| `NODE_ENV`            | 否   | `development`   | 运行环境                         |
| `MONGODB_HOST`        | 否   | `127.0.0.1`     | MongoDB 主机地址                 |
| `MONGODB_PORT`        | 否   | `27017`         | MongoDB 端口                     |
| `MONGODB_DATABASE`    | 否   | `your_database` | 数据库名称                       |
| `MONGODB_ENABLE_AUTH` | 否   | `false`         | 是否启用认证                     |
| `MONGODB_USER`        | 条件 | `""`            | MongoDB 用户名（启用认证时必填） |
| `MONGODB_PASSWORD`    | 条件 | `""`            | MongoDB 密码（启用认证时必填）   |

## 🏗️ 使用 MongoDB

### 📖 示例代码

项目提供了完整的示例代码，包含：

- **示例模型**: `models/ExampleModel.ts` - 演示各种字段类型和验证规则
- **示例路由**: `routes/exampleRoute.ts` - 演示完整的 CRUD 操作

**详细使用说明**: 查看 [EXAMPLES.md](docs/EXAMPLES.md)

### 快速开始

1. **查看示例代码**:

   - 查看 `models/ExampleModel.ts` 了解如何定义模型
   - 查看 `routes/exampleRoute.ts` 了解如何创建 API

2. **创建你的模型**:

```bash
# 复制示例文件
cp models/ExampleModel.ts models/YourModel.ts
```

3. **创建你的路由**:

```bash
# 复制示例文件
cp routes/exampleRoute.ts routes/yourRoute.ts
```

4. **参考示例编写代码**:
   - 修改模型定义以匹配你的数据需求
   - 实现所需的 CRUD 操作
   - 在 `index.ts` 中注册路由

完整示例和最佳实践请参考 [EXAMPLES.md](docs/EXAMPLES.md)

## 🛠️ 数据库连接管理

项目使用 `DatabaseManager` 单例管理数据库连接，提供了以下功能：

- ✅ 自动连接池管理
- ✅ 连接健康检查
- ✅ 自动重连机制（最多 5 次）
- ✅ 优雅关闭
- ✅ 连接状态监控

### 使用示例

```typescript
import { DatabaseManager, createDatabaseConfig } from "./utils/database";

const dbManager = DatabaseManager.getInstance();

// 创建配置
const config = createDatabaseConfig();

// 连接数据库
await dbManager.connect(config);

// 检查连接状态
const status = dbManager.getConnectionStatus();
console.log(status); // { isConnected: true, readyState: 1, status: "connected" }

// 检查健康状态
const isHealthy = dbManager.isHealthy();
```

## 🧪 开发命令

```bash
# 开发模式（自动重启）
npm run dev

# 构建项目
npm run build

# 启动生产服务器
npm start

# PM2 管理
npm run pm2:start    # 启动
npm run pm2:stop     # 停止
npm run pm2:restart  # 重启
npm run pm2:logs     # 查看日志
npm run pm2:status   # 查看状态
```

## 🚢 部署

### 使用 PM2 部署

1. 配置 `ecosystem.config.js`：

```javascript
module.exports = {
  apps: [
    {
      name: "your-app-name",
      script: "dist/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        MONGODB_HOST: "localhost",
        MONGODB_PORT: "27017",
        MONGODB_DATABASE: "your_database",
        // ... 其他环境变量
      },
    },
  ],
};
```

2. 构建并启动：

```bash
npm run build
npm run pm2:start
```

### 使用部署脚本

修改 `deploy.sh` 中的项目路径，然后运行：

```bash
chmod +x deploy.sh
./deploy.sh
```

### Docker 部署

项目包含 `Dockerfile` 和 `docker-compose.yml` 配置文件。

#### 方法一：使用 Docker

```bash
# 构建镜像
docker build -t your-app-name .

# 运行容器
docker run -p 3000:3000 --env-file .env your-app-name
```

#### 方法二：使用 Docker Compose（推荐）

```bash
# 启动所有服务（包括 MongoDB）
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

> **注意**：使用 Docker Compose 时会自动启动一个 MongoDB 容器，适合快速测试。

## 📊 API 端点

### 健康检查

```
GET /health
```

响应示例：

```json
{
  "status": "healthy",
  "database": {
    "isConnected": true,
    "readyState": 1,
    "status": "connected"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 示例 API（包含完整 CRUD 操作）

项目提供了一个完整的示例 API，演示所有 CRUD 操作：

- `GET /api/examples` - 获取所有记录（支持分页和筛选）
- `GET /api/examples/:id` - 获取单条记录
- `POST /api/examples` - 创建新记录
- `PUT /api/examples/:id` - 更新记录
- `DELETE /api/examples/:id` - 删除记录
- `PATCH /api/examples/:id/activate` - 自定义操作示例

详细的示例代码和 API 文档请查看 [EXAMPLES.md](docs/EXAMPLES.md)

## 🔧 故障排查

### MongoDB 连接失败

1. 检查 MongoDB 服务是否运行：

```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl status mongod
```

2. 检查连接参数是否正确（主机、端口、数据库名）
3. 如果启用了认证，检查用户名和密码
4. 检查防火墙设置

### 查看日志

```bash
# PM2 日志
npm run pm2:logs

# 直接运行时的日志
npm run dev
```

## 📚 技术栈

- **Node.js** - JavaScript 运行时
- **Express** - Web 框架
- **TypeScript** - 类型系统
- **Mongoose** - MongoDB ODM
- **dotenv** - 环境变量管理
- **CORS** - 跨域资源共享
- **PM2** - 进程管理器

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙋 常见问题

### Q: 如何修改默认端口？

A: 在 `.env` 文件中设置 `PORT=your_port`，或在启动时使用环境变量。

### Q: 如何启用 MongoDB 认证？

A: 在 `.env` 文件中设置 `MONGODB_ENABLE_AUTH=true`，并配置 `MONGODB_USER` 和 `MONGODB_PASSWORD`。

### Q: 如何添加新的 API 路由？

A: 在 `routes/` 目录下创建新文件，定义路由，然后在 `index.ts` 中使用 `app.use()` 注册。

### Q: 数据库连接断开后会自动重连吗？

A: 是的，项目内置了自动重连机制，最多尝试 5 次，每次间隔 5 秒。

## 📞 支持

如有问题，请提交 Issue 或联系项目维护者。
