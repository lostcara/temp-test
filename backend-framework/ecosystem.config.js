module.exports = {
  apps: [
    {
      name: "express-mongodb-app",
      script: "dist/index.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      // 开发环境配置
      env_development: {
        NODE_ENV: "development",
        PORT: 3000,
        MONGODB_HOST: "localhost",
        MONGODB_PORT: "27017",
        MONGODB_DATABASE: "myapp_dev",
        MONGODB_ENABLE_AUTH: "false",
        LOG_LEVEL: "debug",
      },
      // 生产环境配置
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        MONGODB_HOST: "127.0.0.1",
        MONGODB_PORT: "27017",
        MONGODB_DATABASE: "myapp_prod",
        MONGODB_ENABLE_AUTH: "true",
        MONGODB_USER: "your_username",
        MONGODB_PASSWORD: "your_password",
        LOG_LEVEL: "warn",
      },
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
    },
  ],
};
