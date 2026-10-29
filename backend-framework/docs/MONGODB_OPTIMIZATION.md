# MongoDB 连接优化说明

## 概述

本次优化对 Node.js 应用中的 MongoDB 连接逻辑进行了全面改进，提高了连接的稳定性、可维护性和监控能力。

## 主要优化内容

### 1. 连接配置优化

#### 原始配置问题：

- 连接超时时间过短
- 缺少连接池配置
- 没有重试机制

#### 优化后的配置：

```typescript
const mongooseOptions: mongoose.ConnectOptions = {
  serverSelectionTimeoutMS: 10000, // 增加服务器选择超时时间
  connectTimeoutMS: 15000, // 增加连接超时时间
  socketTimeoutMS: 45000,
  maxPoolSize: 10, // 最大连接池大小
  minPoolSize: 5, // 最小连接池大小
  maxIdleTimeMS: 30000, // 最大空闲时间
  bufferCommands: false, // 禁用 mongoose 缓冲
  retryWrites: true, // 启用重试写入
  retryReads: true, // 启用重试读取
  authSource: MONGODB_DATABASE, // 明确指定认证源
};
```

### 2. 连接管理优化

#### 新增功能：

- **自动重连机制**：连接断开时自动尝试重连，最多重试 5 次
- **连接状态监控**：实时监控连接状态
- **优雅关闭**：应用退出时正确关闭数据库连接

#### 重连策略：

- 重连间隔：5 秒
- 最大重连次数：5 次
- 指数退避：避免频繁重连

### 3. 数据库工具类

创建了 `DatabaseManager` 单例类，提供：

#### 核心功能：

- `connect(config)`: 连接数据库
- `disconnect()`: 断开连接
- `getConnectionStatus()`: 获取连接状态
- `isHealthy()`: 检查连接健康状态

#### 事件监听：

- `connecting`: 连接中
- `connected`: 连接成功
- `error`: 连接错误
- `disconnected`: 连接断开
- `reconnected`: 重新连接成功

### 4. 健康检查系统

#### 新增端点：

- `GET /health`: 数据库健康检查端点

#### 响应格式：

```json
{
  "status": "healthy|unhealthy",
  "database": {
    "status": "connected|disconnected|connecting|disconnecting",
    "connected": true|false,
    "readyState": 0|1|2|3
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### 中间件保护：

- API 路由自动检查数据库连接状态
- 连接不可用时返回 503 状态码

### 5. 错误处理优化

#### 详细错误信息：

- MongoDB 服务器错误
- 网络连接错误
- 认证失败错误

#### 错误分类处理：

- `MongoServerError`: 服务器端错误
- `MongoNetworkError`: 网络连接错误
- 其他错误：通用错误处理

### 6. 日志优化

#### 新增日志特性：

- 使用 emoji 图标增强可读性
- 详细的连接状态信息
- 错误诊断建议

#### 日志示例：

```
🚀 启动服务器...
🔄 正在连接 MongoDB...
✅ MongoDB 连接成功
🎉 服务器启动成功!
📡 HTTP 服务器运行在: http://localhost:3000
🏥 健康检查端点: http://localhost:3000/health
📊 API 端点: http://localhost:3000/api/info
💾 数据库连接状态: connected
```

## 使用方法

### 1. 环境变量配置

创建 `.env` 文件：

```env
# 服务器配置
PORT=3000
NODE_ENV=development

# MongoDB 连接配置
MONGODB_USER=EQUIPMENT
MONGODB_PASSWORD=222126
MONGODB_HOST=127.0.0.1
MONGODB_PORT=27017
MONGODB_DATABASE=EQUIPMENT
```

### 2. 启动应用

```bash
# 开发环境
npm run dev

# 生产环境
npm run build
npm start
```

### 3. 健康检查

```bash
# 检查数据库连接状态
curl http://localhost:3000/health
```

## 文件结构

```
backend-framework/
├── index.ts                 # 主应用文件（已优化）
├── utils/
│   └── database.ts         # 数据库管理工具类（新增）
├── routes/
│   └── contacts.ts         # 路由文件
├── models/
│   └── Contact.ts          # 数据模型
└── MONGODB_OPTIMIZATION.md # 本说明文档
```

## 性能提升

### 连接稳定性：

- 连接池管理：减少连接创建/销毁开销
- 自动重连：提高服务可用性
- 超时优化：避免长时间等待

### 监控能力：

- 实时状态监控
- 健康检查端点
- 详细错误日志

### 开发体验：

- 清晰的错误信息
- 结构化的代码组织
- 易于维护的工具类

## 注意事项

1. **环境变量**：确保正确配置所有必需的环境变量
2. **MongoDB 服务**：确保 MongoDB 服务正在运行
3. **网络连接**：检查防火墙和网络配置
4. **认证信息**：验证用户名、密码和数据库名称

## 故障排除

### 常见问题：

1. **连接超时**：

   - 检查 MongoDB 服务状态
   - 验证网络连接
   - 确认端口配置

2. **认证失败**：

   - 验证用户名和密码
   - 检查认证源配置
   - 确认数据库权限

3. **重连失败**：
   - 检查网络稳定性
   - 查看 MongoDB 日志
   - 验证连接参数

### 调试命令：

```bash
# 检查 MongoDB 服务状态
systemctl status mongod

# 查看 MongoDB 日志
tail -f /var/log/mongodb/mongod.log

# 测试网络连接
telnet localhost 27017
```

## 总结

通过本次优化，MongoDB 连接逻辑得到了显著改进：

- ✅ 提高了连接稳定性和可靠性
- ✅ 增强了错误处理和诊断能力
- ✅ 改善了代码结构和可维护性
- ✅ 添加了完整的监控和健康检查功能
- ✅ 优化了开发和生产环境的体验

这些改进确保了应用能够更好地处理数据库连接问题，提供更稳定的服务。
