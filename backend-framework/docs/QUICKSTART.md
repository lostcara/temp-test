# 快速入门

> 5 分钟快速启动你的项目！

## 🚀 三步快速启动

### 1️⃣ 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑配置文件
# Windows: notepad .env
# Linux/Mac: nano .env
```

**最小配置**（只需修改这几项）：

```env
MONGODB_DATABASE=your_database_name
```

### 2️⃣ 安装依赖

```bash
npm install
```

### 3️⃣ 启动项目

```bash
# 开发模式（推荐首次使用）
npm run dev
```

**完成！** 🎉 服务器运行在 `http://localhost:3000`

## ✅ 验证安装

### 检查健康状态

打开浏览器访问：`http://localhost:3000/health`

应该看到：

```json
{
  "status": "healthy",
  "database": {
    "isConnected": true,
    "status": "connected"
  }
}
```

## 🎯 下一步

### 修改项目名称

1. 编辑 `package.json`：

```json
{
  "name": "your-project-name"
}
```

2. 编辑 `ecosystem.config.js`：

```javascript
{
  name: "your-project-name";
}
```

### 添加你的业务逻辑

查看文档了解如何：

- 📖 创建数据模型 - 查看 `EXAMPLES.md`
- 🔧 添加 API 路由 - 查看 `EXAMPLES.md`
- 🚀 部署到生产环境 - 查看 `USAGE.md`

项目提供了完整的示例代码（`ExampleModel.ts` 和 `exampleRoute.ts`），帮助你快速上手！

## 📚 更多帮助

- 📖 **详细文档**: 查看 `../README.md`
- ⚙️ **配置说明**: 查看 `CONFIG.md`
- 🔧 **使用指南**: 查看 `USAGE.md`
- 💡 **示例代码**: 查看 `EXAMPLES.md`
- 🐛 **故障排查**: 查看 `CONNECTION_DIAGNOSIS.md`

## 💡 常见问题

**Q: MongoDB 连接失败？**  
A: 确保 MongoDB 服务正在运行，或使用 Docker Compose：

```bash
docker-compose up -d
```

**Q: 端口被占用？**  
A: 修改 `.env` 中的 `PORT` 为其他端口

**Q: 如何启用认证？**  
A: 在 `.env` 中设置 `MONGODB_ENABLE_AUTH=true` 并配置用户名密码

---

**需要帮助？** 查看项目文档或提交 Issue！
