# MongoDB 连接诊断指南

## 🔍 已修复的问题

### 1. 重连机制问题

**问题**：`attemptReconnect()` 方法中的连接代码被注释掉，导致自动重连功能失效。

**修复**：

- ✅ 添加了 `dbConfig` 属性保存数据库配置
- ✅ 实现完整的重连逻辑
- ✅ 添加重连失败后的递归重试机制
- ✅ 在主动断开连接时清除配置，避免触发不必要的重连

### 2. 连接配置管理

**优化**：

- ✅ 在 `connect()` 方法中保存配置
- ✅ 在 `disconnect()` 方法中清除配置
- ✅ 重连时使用保存的配置信息

## 🧪 连接测试

### 1. 启动服务器

```bash
cd backend-framework
npm run dev
```

### 2. 检查连接状态

服务器启动后应该看到类似的日志：

```
🚀 启动服务器...
环境: development
尝试连接到数据库...
MongoDB URI: mongodb://EQUIPMENT:******@127.0.0.1:27017/EQUIPMENT?authSource=EQUIPMENT
🔄 正在连接 MongoDB...
✅ MongoDB 连接成功
🎉 服务器启动成功!
📡 HTTP 服务器运行在: http://localhost:3000
🏥 健康检查端点: http://localhost:3000/health
📊 API 端点: http://localhost:3000/api/info
💾 数据库连接状态: connected
```

### 3. 健康检查测试

```bash
# Windows
curl http://localhost:3000/health

# 预期响应
{
  "status": "healthy",
  "database": {
    "status": "connected",
    "connected": true,
    "readyState": 1
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔧 故障排查

### 问题 1: 连接超时

**症状**：

```
❌ 数据库连接失败: connect ETIMEDOUT
```

**解决方案**：

1. 检查 MongoDB 服务是否运行

   ```bash
   # Windows
   net start MongoDB

   # Linux/Mac
   sudo systemctl status mongod
   ```

2. 检查网络连接

   ```bash
   # Windows
   telnet 127.0.0.1 27017

   # Linux/Mac
   nc -zv 127.0.0.1 27017
   ```

3. 检查防火墙设置
   - Windows 防火墙可能阻止了 MongoDB 端口

### 问题 2: 认证失败

**症状**：

```
❌ MongoDB 连接错误: Authentication failed
🔐 认证失败，请检查用户名和密码是否正确
```

**解决方案**：

1. 验证用户名和密码

   ```bash
   # 登录 MongoDB 验证
   mongo -u EQUIPMENT -p 222126 --authenticationDatabase EQUIPMENT
   ```

2. 检查环境变量

   ```bash
   # 查看当前环境变量
   echo $MONGODB_USER
   echo $MONGODB_PASSWORD
   ```

3. 更新数据库配置
   - 修改 `.env` 文件中的凭据
   - 确保使用正确的认证数据库

### 问题 3: 端口被占用

**症状**：

```
❌ 端口 3000 已被占用，请使用其他端口
```

**解决方案**：

1. 查找占用端口的进程

   ```bash
   # Windows
   netstat -ano | findstr :3000

   # Linux/Mac
   lsof -i :3000
   ```

2. 结束进程或更换端口
   ```bash
   # 修改 .env 文件
   PORT=3001
   ```

### 问题 4: 连接断开后无法重连

**症状**：

```
⚠️  MongoDB 连接断开
❌ 无法重连：缺少数据库配置
```

**已修复**：

- ✅ 现在会自动保存和恢复配置
- ✅ 断线后会自动尝试重连
- ✅ 最多重试 5 次，每次间隔 5 秒

## 📊 连接状态说明

### ReadyState 值

- `0` - disconnected: 未连接
- `1` - connected: 已连接
- `2` - connecting: 连接中
- `3` - disconnecting: 断开中

### 健康检查状态

- `healthy`: 连接正常，可以处理请求
- `unhealthy`: 连接异常，无法处理请求

## 🚀 性能优化

### 当前配置

```typescript
{
  serverSelectionTimeoutMS: 10000,  // 10秒选择服务器超时
  connectTimeoutMS: 15000,          // 15秒连接超时
  socketTimeoutMS: 45000,           // 45秒socket超时
  maxPoolSize: 10,                  // 最大10个连接
  minPoolSize: 5,                   // 最小5个连接
  maxIdleTimeMS: 30000,             // 30秒空闲超时
  bufferCommands: false,            // 禁用命令缓冲
  retryWrites: true,                // 启用重试写入
  retryReads: true,                 // 启用重试读取
}
```

### 连接池优势

- ✅ 减少连接创建/销毁开销
- ✅ 提高并发处理能力
- ✅ 自动管理连接生命周期
- ✅ 智能重试机制

## 🔐 安全建议

1. **环境变量保护**

   - 不要将 `.env` 文件提交到版本控制
   - 在生产环境使用安全的配置管理

2. **连接字符串**

   - 使用认证机制
   - 配置适当的访问权限
   - 启用 TLS/SSL（生产环境）

3. **网络安全**
   - 配置防火墙规则
   - 限制 MongoDB 访问来源
   - 使用 VPN 或私有网络

## 📝 使用示例

### 测试 API 端点

```bash
# 提交联系人信息
curl -X POST http://localhost:3000/api/info/submit \
  -H "Content-Type: application/json" \
  -d '{
    "address": "test@example.com",
    "name": "Test User",
    "phone": "1234567890",
    "type": 1,
    "description": "Test description"
  }'
```

### 监控连接状态

```bash
# 每5秒检查一次连接状态
watch -n 5 'curl -s http://localhost:3000/health | jq'
```

## ✅ 验证清单

- [ ] MongoDB 服务正在运行
- [ ] 环境变量配置正确
- [ ] 网络连接正常
- [ ] 认证凭据有效
- [ ] 端口未被占用
- [ ] 防火墙允许连接
- [ ] 健康检查端点响应正常
- [ ] API 端点可以正常处理请求

## 🎯 总结

经过修复，现在的连接系统：

- ✅ 具有完整的自动重连功能
- ✅ 保存和恢复配置信息
- ✅ 提供详细的错误诊断
- ✅ 包含健康检查机制
- ✅ 优化的连接池配置
- ✅ 优雅的错误处理

如果遇到任何连接问题，请参考本指南进行排查。
