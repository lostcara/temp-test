#!/bin/bash

# 部署脚本 - Express + MongoDB 模板项目
# 使用方法: ./deploy.sh [app-name]

APP_NAME=${1:-"express-mongodb-app"}

# 检查环境变量文件是否存在
if [ ! -f .env ]; then
    echo "错误：.env 文件不存在！"
    echo "请根据 .env.example 创建 .env 文件"
    exit 1
fi

# 清理旧的构建和依赖
echo "清理旧的构建和依赖..."
rm -rf dist
rm -rf node_modules
rm -f package-lock.json

# 安装所有依赖（包括开发依赖，因为需要用到 TypeScript 编译）
echo "安装依赖..."
npm install || exit 1

# 构建项目
echo "构建项目..."
npm run build || exit 1

# 清理开发依赖，只保留生产依赖
echo "安装生产依赖..."
rm -rf node_modules
npm install --production || exit 1

# 检查是否已安装 PM2
if ! command -v pm2 &> /dev/null; then
    echo "正在安装 PM2..."
    npm install -g pm2 || exit 1
fi

# 使用 PM2 启动或重启服务
if pm2 list | grep -q "$APP_NAME"; then
    echo "重启服务..."
    pm2 restart $APP_NAME
else
    echo "首次启动服务..."
    pm2 start ecosystem.config.js
fi

echo "部署完成！" 