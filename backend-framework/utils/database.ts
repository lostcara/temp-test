import mongoose from "mongoose";

/**
 * 数据库连接配置接口
 */
export interface DatabaseConfig {
  user: string;
  password: string;
  host: string;
  port: string;
  database: string;
  options?: mongoose.ConnectOptions;
}

/**
 * 数据库连接工具类
 */
export class DatabaseManager {
  private static instance: DatabaseManager;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 5000;
  private dbConfig: DatabaseConfig | null = null;

  private constructor() {
    this.setupEventListeners();
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  /**
   * 设置事件监听器
   */
  private setupEventListeners(): void {
    mongoose.connection.on("connecting", () => {
      console.log("🔄 正在连接 MongoDB...");
    });

    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB 连接成功");
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB 连接错误:", err.message);
      this.isConnected = false;
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️  MongoDB 连接断开");
      this.isConnected = false;

      // 只有在非主动断开时才自动重连
      if (this.dbConfig) {
        this.attemptReconnect();
      }
    });

    mongoose.connection.on("reconnected", () => {
      console.log("🔄 MongoDB 重新连接成功");
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });
  }

  /**
   * 连接数据库
   */
  public async connect(config: DatabaseConfig): Promise<void> {
    try {
      // 保存配置用于重连
      this.dbConfig = config;

      const uri = this.buildConnectionUri(config);
      const options = this.getConnectionOptions(config);

      console.log("尝试连接到数据库...");
      console.log("MongoDB URI:", uri.replace(config.password, "******"));

      await mongoose.connect(uri, options);

      // 等待连接确认
      await this.waitForConnection();
    } catch (error: any) {
      console.error("❌ 数据库连接失败:", error.message);
      throw error;
    }
  }

  /**
   * 断开数据库连接
   */
  public async disconnect(): Promise<void> {
    try {
      // 清除配置，避免触发自动重连
      this.dbConfig = null;

      await mongoose.connection.close();
      console.log("✅ MongoDB 连接已关闭");
    } catch (error) {
      console.error("❌ 关闭数据库连接时出错:", error);
      throw error;
    }
  }

  /**
   * 获取连接状态
   */
  public getConnectionStatus(): {
    isConnected: boolean;
    readyState: number;
    status: string;
  } {
    const statusMap: Record<number, string> = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      status: statusMap[mongoose.connection.readyState] || "unknown",
    };
  }

  /**
   * 检查连接是否健康
   */
  public isHealthy(): boolean {
    return (
      this.isConnected &&
      mongoose.connection.readyState === mongoose.ConnectionStates.connected
    );
  }

  /**
   * 构建连接 URI
   */
  private buildConnectionUri(config: DatabaseConfig): string {
    // 如果没有用户名和密码，使用无认证连接
    if (!config.user || !config.password) {
      return `mongodb://${config.host}:${config.port}/${config.database}`;
    }

    // 使用认证连接
    return `mongodb://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}?authSource=${config.database}`;
  }

  /**
   * 获取连接选项
   */
  private getConnectionOptions(
    config: DatabaseConfig
  ): mongoose.ConnectOptions {
    const defaultOptions: mongoose.ConnectOptions = {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      bufferCommands: false,
      retryWrites: true,
      retryReads: true,
      authSource: config.database,
    };

    return { ...defaultOptions, ...config.options };
  }

  /**
   * 等待连接确认
   */
  private async waitForConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (
        mongoose.connection.readyState === mongoose.ConnectionStates.connected
      ) {
        resolve();
      } else {
        mongoose.connection.once("connected", resolve);
        mongoose.connection.once("error", reject);
      }
    });
  }

  /**
   * 尝试重连
   */
  private async attemptReconnect(): Promise<void> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("❌ 达到最大重连次数，停止重连");
      return;
    }

    // 如果没有保存的配置，无法重连
    if (!this.dbConfig) {
      console.error("❌ 无法重连：缺少数据库配置");
      return;
    }

    this.reconnectAttempts++;
    console.log(
      `🔄 尝试重连 MongoDB (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
    );

    setTimeout(async () => {
      try {
        const uri = this.buildConnectionUri(this.dbConfig!);
        const options = this.getConnectionOptions(this.dbConfig!);

        await mongoose.connect(uri, options);

        // 重连成功后重置计数器
        this.reconnectAttempts = 0;
        console.log("✅ 重连成功");
      } catch (error) {
        console.error("❌ 重连失败:", error);
        // 继续尝试重连
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.attemptReconnect();
        }
      }
    }, this.reconnectDelay);
  }
}

/**
 * 创建数据库配置
 */
export function createDatabaseConfig(): DatabaseConfig {
  // 默认使用无认证连接（通过设置空字符串）
  const enableAuth = process.env.MONGODB_ENABLE_AUTH === "true";

  return {
    user: enableAuth ? process.env.MONGODB_USER || "" : "",
    password: enableAuth ? process.env.MONGODB_PASSWORD || "" : "",
    host: process.env.MONGODB_HOST || "127.0.0.1",
    port: process.env.MONGODB_PORT || "27017",
    database: process.env.MONGODB_DATABASE || "your_database",
  };
}
