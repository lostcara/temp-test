# 配置说明

本文档说明模板项目中的所有配置文件及其用途。

## 📁 配置文件列表

### 核心配置文件

| 文件                  | 用途                | 是否必填 |
| --------------------- | ------------------- | -------- |
| `.env`                | 环境变量配置        | ✅ 必填  |
| `.env.example`        | 环境变量示例        | 📝 参考  |
| `package.json`        | 项目依赖和脚本      | ✅ 必填  |
| `tsconfig.json`       | TypeScript 配置     | ✅ 必填  |
| `ecosystem.config.js` | PM2 配置            | 🔧 可选  |
| `docker-compose.yml`  | Docker Compose 配置 | 🐳 可选  |
| `Dockerfile`          | Docker 镜像配置     | 🐳 可选  |

## 🔧 详细配置说明

### 1. 环境变量配置 (`.env`)

这是最重要的配置文件，需要根据你的实际环境修改。

#### 配置步骤

1. 复制示例文件：

```bash
cp .env.example .env
```

2. 编辑 `.env` 文件并修改以下变量：

```env
# 服务器配置
PORT=3000                      # 应用端口（必填）
NODE_ENV=development           # 运行环境：development/production

# MongoDB 配置（必填）
MONGODB_HOST=127.0.0.1         # MongoDB 主机地址
MONGODB_PORT=27017             # MongoDB 端口
MONGODB_DATABASE=your_database # 数据库名称

# MongoDB 认证配置（可选）
MONGODB_ENABLE_AUTH=false      # 是否启用认证：true/false
MONGODB_USER=your_username     # MongoDB 用户名（启用认证时必填）
MONGODB_PASSWORD=your_password # MongoDB 密码（启用认证时必填）
```

#### 配置示例

**本地开发（无认证）**：

```env
PORT=3000
NODE_ENV=development
MONGODB_HOST=127.0.0.1
MONGODB_PORT=27017
MONGODB_DATABASE=myapp_dev
MONGODB_ENABLE_AUTH=false
```

**生产环境（带认证）**：

```env
PORT=3000
NODE_ENV=production
MONGODB_HOST=mongodb.example.com
MONGODB_PORT=27017
MONGODB_DATABASE=myapp_prod
MONGODB_ENABLE_AUTH=true
MONGODB_USER=production_user
MONGODB_PASSWORD=secure_password_123
```

**远程 MongoDB Atlas**：

```env
PORT=3000
NODE_ENV=production
MONGODB_HOST=cluster0.xxxxx.mongodb.net
MONGODB_PORT=27017
MONGODB_DATABASE=myapp
MONGODB_ENABLE_AUTH=true
MONGODB_USER=atlas_user
MONGODB_PASSWORD=atlas_password
```

### 2. PM2 配置 (`ecosystem.config.js`)

用于生产环境的进程管理。

#### 必须修改的配置

```javascript
module.exports = {
  apps: [
    {
      name: "your-app-name", // ⚠️ 修改为你的应用名称
      env: {
        MONGODB_DATABASE: "your_database", // ⚠️ 修改为你的数据库名
        // ... 其他环境变量
      },
    },
  ],
};
```

#### 配置说明

- `name`: 应用名称，用于 PM2 管理
- `script`: 启动脚本路径
- `instances`: 实例数量（1 = 单实例）
- `max_memory_restart`: 内存超限自动重启
- `error_file` / `out_file`: 日志文件路径

### 3. Docker Compose 配置 (`docker-compose.yml`)

用于一键启动应用和 MongoDB。

#### 配置修改

```yaml
services:
  backend:
    environment:
      - MONGODB_DATABASE=your_database # ⚠️ 修改为你的数据库名
      # ... 其他环境变量

  mongodb:
    environment:
      - MONGO_INITDB_DATABASE=your_database # ⚠️ 修改为你的数据库名
```

### 4. TypeScript 配置 (`tsconfig.json`)

通常不需要修改，除非有特殊需求。

### 5. Package.json 配置

#### 必须修改的字段

```json
{
  "name": "your-project-name", // ⚠️ 修改为你的项目名
  "description": "Your project description", // ⚠️ 修改描述
  "scripts": {
    "pm2:stop": "pm2 stop your-app-name", // ⚠️ 与应用名一致
    "pm2:restart": "pm2 restart your-app-name", // ⚠️ 与应用名一致
    "pm2:logs": "pm2 logs your-app-name" // ⚠️ 与应用名一致
  }
}
```

## 🚀 配置流程

### 第一次使用模板

1. **克隆项目**

```bash
git clone <template-repo> my-project
cd my-project
```

2. **修改项目名称**

- 更新 `package.json` 中的 `name` 字段
- 更新 `ecosystem.config.js` 中的 `name` 字段
- 更新 PM2 脚本中的应用名称

3. **配置环境变量**

```bash
cp .env.example .env
# 编辑 .env 文件
```

4. **配置数据库连接**

- 设置 MongoDB 主机、端口、数据库名
- 如需要认证，设置用户名和密码

5. **安装依赖**

```bash
npm install
```

6. **测试运行**

```bash
npm run dev
```

## ✅ 配置检查清单

配置完成后，使用以下清单检查：

- [ ] `.env` 文件已创建并配置
- [ ] MongoDB 连接信息正确
- [ ] `package.json` 中的项目名称已更新
- [ ] `ecosystem.config.js` 中的应用名称已更新
- [ ] PM2 脚本中的应用名称已更新
- [ ] 数据库连接测试通过
- [ ] 健康检查端点正常（`/health`）

## 🔍 配置验证

### 测试数据库连接

```bash
# 启动开发服务器
npm run dev

# 应该看到连接成功的日志
# ✅ MongoDB 连接成功
```

### 测试 API 端点

```bash
# 健康检查
curl http://localhost:3000/health

# 应该返回：
# {"status":"healthy","database":{...}}
```

## 🛠️ 常见配置问题

### 1. 端口被占用

**问题**：`端口 3000 已被占用`

**解决**：修改 `.env` 中的 `PORT` 变量

```env
PORT=3001
```

### 2. MongoDB 连接失败

**问题**：`❌ 数据库连接失败`

**解决**：

- 检查 MongoDB 服务是否运行
- 验证主机、端口配置是否正确
- 检查认证信息（如果启用了认证）

### 3. 应用名称不一致

**问题**：PM2 命令找不到应用

**解决**：确保以下文件中的应用名称一致：

- `ecosystem.config.js` 中的 `name`
- `package.json` 中 PM2 脚本中的应用名

## 📚 更多信息

- 详细使用说明：查看 `USAGE.md`
- 示例代码和教程：查看 `EXAMPLES.md`
- 故障排查：查看 `CONNECTION_DIAGNOSIS.md`
- 性能优化：查看 `MONGODB_OPTIMIZATION.md`
