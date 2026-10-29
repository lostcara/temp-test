import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import exampleRouter from "./routes/exampleRoute";
import authRouter from "./routes/auth";
import alarmInfosRouter from "./routes/alarmInfos";
import deviceInfosRouter from "./routes/deviceInfos";
import devicePortraitsRouter from "./routes/devicePortraits";
import threatInferencesRouter from "./routes/threatInferences";
import securityKnowledgesRouter from "./routes/securityKnowledges";
import { DatabaseManager, createDatabaseConfig } from "./utils/database";
import { JwtUtils } from "./utils/jwt";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 初始化数据库管理器
const dbManager = DatabaseManager.getInstance();

// CORS 配置
const corsOptions = {
  origin: true, // 开发环境下允许所有来源
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Length", "X-Requested-With"],
  optionsSuccessStatus: 204,
  maxAge: 86400, // 预检请求缓存24小时
};

// 中间件
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 安全相关的响应头
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// 数据库健康检查中间件
app.use("/api/info", (req, res, next) => {
  if (!dbManager.isHealthy()) {
    return res.status(503).json({
      message: "数据库连接不可用",
      error: "Database connection unavailable",
    });
  }
  next();
});

// 路由
// 认证路由 - 用户注册、登录、个人信息管理
app.use("/api/auth", authRouter);

// 示例路由 - 演示基础的 CRUD 操作
app.use("/api/examples", exampleRouter);

// 告警信息路由
app.use("/api/alarm-infos", alarmInfosRouter);

// 设备信息路由
app.use("/api/device-infos", deviceInfosRouter);

// 设备画像路由
app.use("/api/device-portraits", devicePortraitsRouter);

// 威胁推理路由
app.use("/api/threat-inferences", threatInferencesRouter);

// 安全知识路由
app.use("/api/security-knowledges", securityKnowledgesRouter);

// 在这里添加你的自定义路由
// app.use("/api/your-resource", yourRouter);

// 健康检查端点
app.get("/health", (req, res) => {
  const connectionStatus = dbManager.getConnectionStatus();

  res.json({
    status: dbManager.isHealthy() ? "healthy" : "unhealthy",
    database: connectionStatus,
    timestamp: new Date().toISOString(),
  });
});

// 优雅关闭连接
process.on("SIGINT", async () => {
  try {
    await dbManager.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("关闭 MongoDB 连接时出错:", err);
    process.exit(1);
  }
});

// 连接数据库并启动服务器
async function startServer() {
  try {
    console.log("🚀 启动服务器...");
    console.log("环境:", process.env.NODE_ENV || "development");

    // 验证 JWT 配置
    const jwtValidation = JwtUtils.validateConfig();
    if (!jwtValidation.valid) {
      console.warn("⚠️  JWT 配置警告:");
      jwtValidation.errors.forEach((error) => console.warn("   -", error));
    }

    // 创建数据库配置
    const dbConfig = createDatabaseConfig();

    // 连接数据库
    await dbManager.connect(dbConfig);

    // 启动 HTTP 服务器
    const server = app.listen(PORT, () => {
      console.log("🎉 服务器启动成功!");
      console.log(`📡 HTTP 服务器运行在: http://localhost:${PORT}`);
      console.log(`🏥 健康检查端点: http://localhost:${PORT}/health`);
      console.log("📊 API 端点:");
      console.log(`   🔐 认证接口: http://localhost:${PORT}/api/auth`);
      console.log(`   💡 示例接口: http://localhost:${PORT}/api/examples`);
      console.log(`   🚨 告警信息: http://localhost:${PORT}/api/alarm-infos`);
      console.log(`   📱 设备信息: http://localhost:${PORT}/api/device-infos`);
      console.log(
        `   🎨 设备画像: http://localhost:${PORT}/api/device-portraits`
      );
      console.log(
        `   🔍 威胁推理: http://localhost:${PORT}/api/threat-inferences`
      );
      console.log(
        `   📚 安全知识: http://localhost:${PORT}/api/security-knowledges`
      );
      console.log(
        `💾 数据库连接状态: ${dbManager.getConnectionStatus().status}`
      );
    });

    // 服务器错误处理
    server.on("error", (error: any) => {
      if (error.code === "EADDRINUSE") {
        console.error(`❌ 端口 ${PORT} 已被占用，请使用其他端口`);
      } else {
        console.error("❌ 服务器错误:", error);
      }
      process.exit(1);
    });
  } catch (error: any) {
    console.error("❌ 启动服务器时出错:", error.message);

    if (error.name === "MongoServerError") {
      console.error("🔍 MongoDB 错误详情:");
      console.error("  - 错误代码:", error.code);
      console.error("  - 错误信息:", error.errmsg);
      console.error("  - 错误名称:", error.name);
    } else if (error.name === "MongoNetworkError") {
      console.error("🌐 网络连接错误，请检查:");
      console.error("  - MongoDB 服务是否运行");
      console.error("  - 网络连接是否正常");
      console.error("  - 主机地址和端口是否正确");
    }

    console.error("💡 建议检查:");
    console.error("  - MongoDB 服务状态");
    console.error("  - 连接参数配置");
    console.error("  - 防火墙设置");

    process.exit(1);
  }
}

// 启动服务器
startServer().catch((err) => {
  console.error("服务器启动失败:", err);
  process.exit(1);
});
