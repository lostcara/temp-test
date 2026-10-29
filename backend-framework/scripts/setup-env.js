/**
 * 环境配置设置脚本
 * 用于首次设置或切换环境时自动创建 .env 文件
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const rootDir = path.join(__dirname, "..");
const envExamplePath = path.join(rootDir, ".env.example.txt");
const envDevPath = path.join(rootDir, ".env.development.template");
const envProdPath = path.join(rootDir, ".env.production.template");
const envPath = path.join(rootDir, ".env");

console.log("\n🔧 环境配置设置向导\n");
console.log("=".repeat(50));

// 检查是否已存在 .env 文件
if (fs.existsSync(envPath)) {
  console.log("⚠️  检测到已存在 .env 文件");
  rl.question("\n是否要覆盖现有文件？(y/N): ", (answer) => {
    if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
      selectEnvironment();
    } else {
      console.log("\n✅ 保留现有配置文件，设置取消。");
      rl.close();
    }
  });
} else {
  selectEnvironment();
}

function selectEnvironment() {
  console.log("\n请选择环境：");
  console.log("  1) 开发环境 (development)");
  console.log("  2) 生产环境 (production)");
  console.log("  3) 使用示例配置 (example)");

  rl.question("\n输入选项 (1/2/3): ", (choice) => {
    let sourceFile;
    let envName;

    switch (choice.trim()) {
      case "1":
        sourceFile = envDevPath;
        envName = "development";
        break;
      case "2":
        sourceFile = envProdPath;
        envName = "production";
        break;
      case "3":
        sourceFile = envExamplePath;
        envName = "example";
        break;
      default:
        console.log("\n❌ 无效选项，请重新运行脚本。");
        rl.close();
        return;
    }

    // 检查源文件是否存在
    if (!fs.existsSync(sourceFile)) {
      console.log(`\n❌ 错误：找不到源文件 ${path.basename(sourceFile)}`);
      rl.close();
      return;
    }

    // 复制文件
    try {
      fs.copyFileSync(sourceFile, envPath);
      console.log(`\n✅ 成功！已创建 .env 文件（基于 ${envName} 环境）`);
      console.log("\n📝 下一步：");
      console.log("  1. 编辑 .env 文件，修改数据库连接信息");
      console.log("  2. 运行 npm run dev 启动开发服务器");
      console.log("  3. 访问 http://localhost:3000/health 检查服务状态");
      console.log("\n" + "=".repeat(50));
    } catch (error) {
      console.log(`\n❌ 创建 .env 文件失败：${error.message}`);
    }

    rl.close();
  });
}
