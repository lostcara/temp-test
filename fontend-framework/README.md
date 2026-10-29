# 设备管理系统 - 使用文档

## 📋 目录

- [环境要求](#环境要求)
- [准备工作](#准备工作)
- [安装步骤](#安装步骤)
- [项目启动](#项目启动)
- [项目结构](#项目结构)
- [常见问题](#常见问题)

---

## 🔧 环境要求

### Node.js 和 npm

- **Node.js**: >= 16.0.0 (推荐使用 LTS 版本)
- **npm**: >= 8.0.0 (通常随 Node.js 一起安装)

### MongoDB

- **MongoDB**: >= 5.0.0 (推荐使用最新稳定版)
- **MongoDB Compass**: 最新版本（用于数据库可视化管理）

### 其他工具

- **Git**: 用于版本控制
- **代码编辑器**: 推荐使用 VS Code

---

## 📦 准备工作

### 1. 安装 Node.js 和 npm

#### Windows 系统

1. **下载 Node.js**
   - 访问 [Node.js 官网](https://nodejs.org/)
   - 下载 LTS（长期支持）版本
   - 运行安装程序，按照提示完成安装
   - 安装完成后，npm 会自动随 Node.js 一起安装

2. **验证安装**
   ```bash
   node -v
   npm -v
   ```

3. **更新 npm 到最新版本**
   ```bash
   # 使用 npm 自带的更新命令
   npm install -g npm@latest
   
   # 或者使用 npm-check-updates (推荐)
   npm install -g npm-check-updates
   ncu -u
   ```

#### macOS 系统

1. **使用 Homebrew 安装（推荐）**
   ```bash
   # 安装 Homebrew（如果未安装）
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   
   # 安装 Node.js
   brew install node
   ```

2. **验证安装**
   ```bash
   node -v
   npm -v
   ```

3. **更新 npm**
   ```bash
   npm install -g npm@latest
   ```

#### Linux 系统

1. **使用 NodeSource 仓库安装（推荐）**
   ```bash
   # Ubuntu/Debian
   curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # CentOS/RHEL
   curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
   sudo yum install -y nodejs
   ```

2. **验证安装**
   ```bash
   node -v
   npm -v
   ```

3. **更新 npm**
   ```bash
   npm install -g npm@latest
   ```

### 2. 安装 MongoDB

#### Windows 系统

1. **下载 MongoDB**
   - 访问 [MongoDB 官网](https://www.mongodb.com/try/download/community)
   - 选择 Windows 版本
   - 下载 MSI 安装程序

2. **安装 MongoDB**
   - 运行下载的 MSI 安装程序
   - 选择 "Complete" 完整安装
   - 选择 "Install MongoDB as a Service"（作为服务安装）
   - 选择 "Run service as Network Service user"
   - 取消勾选 "Install MongoDB Compass"（我们稍后单独安装）
   - 完成安装

3. **验证安装**
   ```bash
   # 检查 MongoDB 服务是否运行
   # 打开服务管理器（services.msc），查找 MongoDB 服务
   
   # 或者使用命令行
   mongod --version
   mongo --version
   ```

4. **启动 MongoDB 服务**
   - MongoDB 安装后会自动作为 Windows 服务启动
   - 如果没有启动，可以在服务管理器中手动启动
   - 或者使用命令行：
     ```bash
     net start MongoDB
     ```

#### macOS 系统

1. **使用 Homebrew 安装（推荐）**
   ```bash
   # 添加 MongoDB tap
   brew tap mongodb/brew
   
   # 安装 MongoDB
   brew install mongodb-community
   
   # 启动 MongoDB 服务
   brew services start mongodb-community
   ```

2. **验证安装**
   ```bash
   mongod --version
   mongosh --version
   ```

#### Linux 系统

1. **Ubuntu/Debian**
   ```bash
   # 导入 MongoDB GPG 密钥
   curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
   
   # 添加 MongoDB 仓库
   echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
   
   # 更新包列表
   sudo apt-get update
   
   # 安装 MongoDB
   sudo apt-get install -y mongodb-org
   
   # 启动 MongoDB 服务
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

2. **CentOS/RHEL**
   ```bash
   # 创建 MongoDB 仓库文件
   sudo vi /etc/yum.repos.d/mongodb-org-7.0.repo
   
   # 添加以下内容：
   [mongodb-org-7.0]
   name=MongoDB Repository
   baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/7.0/x86_64/
   gpgcheck=1
   enabled=1
   gpgkey=https://www.mongodb.org/static/pgp/server-7.0.asc
   
   # 安装 MongoDB
   sudo yum install -y mongodb-org
   
   # 启动 MongoDB 服务
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

### 3. 安装 MongoDB Compass

MongoDB Compass 是 MongoDB 的官方图形界面管理工具。

#### Windows/macOS/Linux

1. **下载 MongoDB Compass**
   - 访问 [MongoDB Compass 下载页面](https://www.mongodb.com/try/download/compass)
   - 选择对应的操作系统版本
   - 下载安装程序

2. **安装 MongoDB Compass**
   - Windows: 运行 MSI 安装程序
   - macOS: 运行 DMG 文件，将 Compass 拖到应用程序文件夹
   - Linux: 解压下载的文件，运行可执行文件

3. **连接 MongoDB**
   - 打开 MongoDB Compass
   - 默认连接字符串：`mongodb://localhost:27017`
   - 点击 "Connect" 连接

---

## 🚀 安装步骤

### 1. 克隆项目

```bash
git clone <项目地址>
cd Device_Manage
```

### 2. 安装后端依赖

```bash
cd backend-framework
npm install
```

### 3. 配置后端环境变量

在 `backend-framework` 目录下创建 `.env` 文件：

```env
# MongoDB 连接配置
MONGODB_USER=your_username
MONGODB_PASSWORD=your_password
MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_DATABASE=device_manage

# 服务器配置
PORT=3000
NODE_ENV=development

# JWT 密钥（用于身份验证）
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
```

**注意**：
- 如果 MongoDB 没有设置用户名和密码，可以省略 `MONGODB_USER` 和 `MONGODB_PASSWORD`
- `JWT_SECRET` 应该是一个随机生成的字符串，用于加密 JWT token

### 4. 安装前端依赖

```bash
cd ../fontend-framework
npm install
```

### 5. 配置前端环境变量（可选）

在 `fontend-framework` 目录下创建 `.env` 文件（如果需要自定义配置）：

```env
# API 基础地址
VITE_APP_BASE_API=http://localhost:3000
```

---

## 🎯 项目启动

### 启动后端服务

```bash
cd backend-framework

# 开发模式
npm run dev

# 或者使用环境变量文件
npm run dev:load-env
```

后端服务将在 `http://localhost:3000` 启动

### 启动前端服务

```bash
cd fontend-framework

# 开发模式
npm run dev
```

前端服务将在 `http://localhost:8080` 启动（默认端口）

### 访问应用

- 前端地址：http://localhost:8080
- 后端 API：http://localhost:3000/api

---

## 📁 项目结构

```
Device_Manage/
├── backend-framework/          # 后端项目
│   ├── models/                 # 数据模型
│   │   ├── AlarmInfoModel.ts   # 告警信息模型
│   │   ├── DeviceInfoModel.ts  # 设备信息模型
│   │   ├── DevicePortrait.ts   # 设备画像模型
│   │   ├── SecurityKnowledge.ts # 安全知识模型
│   │   └── ThreatInference.ts  # 威胁推理模型
│   ├── routes/                 # API 路由
│   │   ├── alarmInfos.ts       # 告警信息接口
│   │   ├── deviceInfos.ts      # 设备信息接口
│   │   ├── devicePortraits.ts  # 设备画像接口
│   │   ├── securityKnowledges.ts # 安全知识接口
│   │   └── threatInferences.ts # 威胁推理接口
│   ├── utils/                  # 工具函数
│   │   ├── database.ts         # 数据库连接管理
│   │   ├── jwt.ts              # JWT 工具
│   │   └── uuid.ts             # UUID 生成工具
│   ├── data/                   # Mock 数据
│   │   ├── alarms.json         # 告警信息数据
│   │   ├── devices.json        # 设备信息数据
│   │   ├── devicePortraits.json # 设备画像数据
│   │   ├── securityKnowledges.json # 安全知识数据
│   │   └── threatInferences.json # 威胁推理数据
│   ├── index.ts                # 应用入口
│   └── package.json            # 依赖配置
│
└── fontend-framework/          # 前端项目
    ├── src/
    │   ├── api/                # API 接口定义
    │   ├── views/              # 页面组件
    │   │   ├── SystemState/    # 系统状态页面
    │   │   │   ├── Alarm/      # 告警信息
    │   │   │   └── Device/     # 设备信息
    │   │   ├── Equipment/      # 设备管理页面
    │   │   │   └── Portrait/   # 设备画像
    │   │   ├── Security/       # 安全管理页面
    │   │   │   └── Knowledge/  # 安全知识
    │   │   └── Threat/         # 威胁管理页面
    │   │       └── Inference/  # 威胁推理
    │   ├── components/         # 公共组件
    │   ├── utils/              # 工具函数
    │   └── router/             # 路由配置
    └── package.json            # 依赖配置
```

---

## 🔍 常见问题

### 1. npm 安装依赖失败

**问题**：`npm install` 执行失败或很慢

**解决方案**：
```bash
# 使用国内镜像源（推荐）
npm config set registry https://registry.npmmirror.com

# 或者使用 cnpm
npm install -g cnpm --registry=https://registry.npmmirror.com
cnpm install
```

### 2. MongoDB 连接失败

**问题**：后端无法连接到 MongoDB

**解决方案**：
1. 检查 MongoDB 服务是否运行
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl status mongod
   ```

2. 检查 MongoDB 连接字符串是否正确
   - 确认 `.env` 文件中的配置正确
   - 确认 MongoDB 端口是否为默认的 27017

3. 使用 MongoDB Compass 测试连接
   - 打开 MongoDB Compass
   - 尝试连接 `mongodb://localhost:27017`

### 3. 端口被占用

**问题**：3000 或 8080 端口已被占用

**解决方案**：
```bash
# Windows 查看端口占用
netstat -ano | findstr :3000

# macOS/Linux 查看端口占用
lsof -i :3000

# 修改端口
# 后端：修改 .env 文件中的 PORT
# 前端：修改 vite.config.ts 中的 port 配置
```

### 4. 前端无法连接后端 API

**问题**：前端请求后端 API 失败

**解决方案**：
1. 确认后端服务已启动
2. 检查 `vite.config.ts` 中的代理配置
3. 确认 `VITE_APP_BASE_API` 环境变量配置正确

### 5. TypeScript 编译错误

**问题**：TypeScript 类型错误

**解决方案**：
```bash
# 重新安装依赖
rm -rf node_modules package-lock.json
npm install

# 检查 TypeScript 版本
npm list typescript
```

### 6. MongoDB Compass 无法连接

**问题**：MongoDB Compass 连接失败

**解决方案**：
1. 确认 MongoDB 服务正在运行
2. 检查防火墙设置
3. 尝试使用连接字符串：`mongodb://127.0.0.1:27017`

---
