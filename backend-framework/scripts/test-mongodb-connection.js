/**
 * MongoDB 连接测试脚本
 * 用于快速测试数据库连接是否正常
 */

const dotenv = require("dotenv");
const mongoose = require("mongoose");

// 加载环境变量
dotenv.config();

console.log("\n🔍 MongoDB 连接测试工具\n");
console.log("=".repeat(60));

// 读取环境变量
const config = {
  host: process.env.MONGODB_HOST || "127.0.0.1",
  port: process.env.MONGODB_PORT || "27017",
  database: process.env.MONGODB_DATABASE || "test_db",
  enableAuth: process.env.MONGODB_ENABLE_AUTH === "true",
  user: process.env.MONGODB_USER || "",
  password: process.env.MONGODB_PASSWORD || "",
};

console.log("📋 测试配置信息:");
console.log("  - 主机地址:", config.host);
console.log("  - 端口:", config.port);
console.log("  - 数据库:", config.database);
console.log("  - 启用认证:", config.enableAuth);
if (config.enableAuth) {
  console.log("  - 用户名:", config.user);
  console.log("  - 密码:", config.password ? "***" : "(未设置)");
}
console.log("=".repeat(60));

// 构建连接字符串
let connectionString;
if (config.enableAuth && config.user && config.password) {
  connectionString = `mongodb://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}?authSource=admin`;
} else {
  connectionString = `mongodb://${config.host}:${config.port}/${config.database}`;
}

console.log("\n🔗 连接字符串:");
// 隐藏密码显示
const displayConnectionString = config.password
  ? connectionString.replace(config.password, "***")
  : connectionString;
console.log("  ", displayConnectionString);
console.log("\n⏳ 正在连接数据库...\n");

// 设置连接选项
const options = {
  serverSelectionTimeoutMS: 5000, // 5秒超时
  socketTimeoutMS: 5000,
};

// 测试连接
async function testConnection() {
  const startTime = Date.now();

  try {
    // 连接数据库
    await mongoose.connect(connectionString, options);
    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log("✅ 数据库连接成功！\n");
    console.log("📊 连接详情:");
    console.log(
      "  - 连接状态:",
      getReadyStateText(mongoose.connection.readyState)
    );
    console.log("  - 响应时间:", `${duration}ms`);
    console.log("  - 主机:", mongoose.connection.host);
    console.log("  - 端口:", mongoose.connection.port);
    console.log("  - 数据库:", mongoose.connection.name);

    // 测试数据库操作
    console.log("\n🧪 测试数据库操作...");

    // 列出所有集合
    try {
      const collections = await mongoose.connection.db
        .listCollections()
        .toArray();
      console.log(
        "  - 现有集合数量:",
        collections.length,
        collections.length > 0 ? "" : "(数据库为空)"
      );

      if (collections.length > 0) {
        console.log("  - 集合列表:");
        collections.forEach((col, index) => {
          console.log(`    ${index + 1}. ${col.name}`);
        });
      }
    } catch (error) {
      console.log("  ⚠️  无法列出集合:", error.message);
    }

    // 测试写入权限
    console.log("\n📝 测试写入权限...");
    try {
      const testCollection =
        mongoose.connection.db.collection("_connection_test");
      const testDoc = {
        test: true,
        timestamp: new Date(),
        message: "MongoDB 连接测试",
      };

      await testCollection.insertOne(testDoc);
      console.log("  ✅ 写入测试成功");

      // 清理测试数据
      await testCollection.deleteOne({ test: true });
      console.log("  ✅ 删除测试成功");
    } catch (error) {
      console.log("  ❌ 写入测试失败:", error.message);
    }

    console.log("\n" + "=".repeat(60));
    console.log("✅ 所有测试通过！数据库连接正常。");
    console.log("=".repeat(60));
    console.log("\n💡 下一步：");
    console.log("  1. 运行 npm run dev 启动开发服务器");
    console.log("  2. 访问 http://localhost:3000/health 检查服务状态");
    console.log("  3. 开始开发你的应用\n");

    process.exit(0);
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log("❌ 数据库连接失败！\n");
    console.log("📊 错误详情:");
    console.log("  - 错误类型:", error.name);
    console.log("  - 错误信息:", error.message);
    console.log("  - 尝试时间:", `${duration}ms`);

    console.log("\n" + "=".repeat(60));
    console.log("🔧 故障排查建议:");
    console.log("=".repeat(60));

    // 根据错误类型提供具体建议
    if (
      error.name === "MongoNetworkError" ||
      error.message.includes("ECONNREFUSED")
    ) {
      console.log("\n❌ 网络连接错误 - MongoDB 服务可能未运行\n");
      console.log("解决方案：");
      console.log("  1. 检查 MongoDB 服务是否运行：");
      console.log("\n     Windows:");
      console.log("       net start MongoDB");
      console.log("\n     macOS:");
      console.log("       brew services start mongodb-community");
      console.log("\n     Linux:");
      console.log("       sudo systemctl start mongod");
      console.log("       sudo systemctl status mongod");
      console.log("\n  2. 检查 MongoDB 是否监听在正确的端口：", config.port);
      console.log("  3. 检查防火墙设置是否阻止了连接");
    } else if (
      error.name === "MongoServerError" &&
      error.message.includes("Authentication failed")
    ) {
      console.log("\n❌ 认证失败 - 用户名或密码错误\n");
      console.log("解决方案：");
      console.log("  1. 检查 .env 文件中的用户名和密码是否正确");
      console.log("  2. 确认用户是否存在于 MongoDB 中");
      console.log("  3. 如果是本地开发，可以暂时关闭认证：");
      console.log("       MONGODB_ENABLE_AUTH=false");
    } else if (error.message.includes("ENOTFOUND")) {
      console.log("\n❌ DNS 解析失败 - 主机地址无法解析\n");
      console.log("解决方案：");
      console.log("  1. 检查 .env 文件中的 MONGODB_HOST 是否正确");
      console.log("  2. 如果使用域名，确认 DNS 解析正常");
      console.log("  3. 尝试使用 IP 地址替代域名");
    } else if (error.message.includes("timeout")) {
      console.log("\n❌ 连接超时\n");
      console.log("解决方案：");
      console.log("  1. 检查网络连接");
      console.log("  2. 确认 MongoDB 服务器可访问");
      console.log("  3. 检查防火墙设置");
    } else {
      console.log("\n❌ 其他错误\n");
      console.log("解决方案：");
      console.log("  1. 查看详细错误信息");
      console.log("  2. 检查所有配置项是否正确");
      console.log("  3. 查看 MongoDB 服务器日志");
    }

    console.log("\n📚 更多帮助：");
    console.log("  - 查看配置文档: docs/CONFIG.md");
    console.log("  - 查看连接诊断: docs/CONNECTION_DIAGNOSIS.md");
    console.log("  - 查看环境配置: docs/ENVIRONMENT_SETUP.md\n");

    process.exit(1);
  } finally {
    // 关闭连接
    try {
      await mongoose.connection.close();
    } catch (err) {
      // 忽略关闭错误
    }
  }
}

// 获取连接状态文本
function getReadyStateText(state) {
  const states = {
    0: "已断开",
    1: "已连接",
    2: "正在连接",
    3: "正在断开",
  };
  return states[state] || "未知";
}

// 运行测试
testConnection();
