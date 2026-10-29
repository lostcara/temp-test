import jwt from "jsonwebtoken";
import { IUser } from "../models/User";

/**
 * JWT 载荷接口
 */
export interface JwtPayload {
  userId: string;
  username: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * JWT 工具类
 *
 * 提供 JWT token 的生成、验证和解析功能
 */
export class JwtUtils {
  private static readonly JWT_SECRET =
    process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
  private static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
  private static readonly JWT_REFRESH_EXPIRES_IN =
    process.env.JWT_REFRESH_EXPIRES_IN || "30d";

  /**
   * 生成访问令牌
   * @param user 用户对象
   * @returns JWT token 字符串
   */
  static generateAccessToken(user: IUser): string {
    const payload: JwtPayload = {
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
      issuer: "backend-template",
      audience: "frontend-app",
    } as jwt.SignOptions);
  }

  /**
   * 生成刷新令牌
   * @param user 用户对象
   * @returns 刷新 token 字符串
   */
  static generateRefreshToken(user: IUser): string {
    const payload = {
      userId: user._id.toString(),
      type: "refresh",
    };

    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_REFRESH_EXPIRES_IN,
      issuer: "backend-template",
      audience: "frontend-app",
    } as jwt.SignOptions);
  }

  /**
   * 验证并解析 token
   * @param token JWT token 字符串
   * @returns 解析后的载荷
   */
  static verifyToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET, {
        issuer: "backend-template",
        audience: "frontend-app",
      }) as JwtPayload;

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error("Token 已过期");
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("无效的 Token");
      } else {
        throw new Error("Token 验证失败");
      }
    }
  }

  /**
   * 解析 token（不验证签名，仅用于获取信息）
   * @param token JWT token 字符串
   * @returns 解析后的载荷
   */
  static decodeToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.decode(token) as JwtPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  /**
   * 检查 token 是否即将过期（1小时内）
   * @param token JWT token 字符串
   * @returns 是否即将过期
   */
  static isTokenNearExpiry(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return false;
    }

    const now = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = decoded.exp - now;

    // 如果剩余时间少于1小时（3600秒），则认为即将过期
    return timeUntilExpiry < 3600;
  }

  /**
   * 从 Authorization header 中提取 token
   * @param authHeader Authorization header 值
   * @returns token 字符串或 null
   */
  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader) {
      return null;
    }

    // 支持 "Bearer token" 格式
    const parts = authHeader.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      return parts[1];
    }

    // 直接返回 token（兼容性）
    return authHeader;
  }

  /**
   * 生成完整的认证响应
   * @param user 用户对象
   * @returns 包含 token 和用户信息的响应对象
   */
  static generateAuthResponse(user: IUser) {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      success: true,
      message: "认证成功",
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          avatar: user.avatar,
          profile: user.profile,
          fullName: user.fullName || user.username,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt,
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: this.JWT_EXPIRES_IN,
        },
      },
    };
  }

  /**
   * 验证环境变量配置
   * @returns 配置是否有效
   */
  static validateConfig(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (
      !process.env.JWT_SECRET ||
      process.env.JWT_SECRET ===
        "your-super-secret-jwt-key-change-in-production"
    ) {
      errors.push("请在生产环境中设置 JWT_SECRET 环境变量");
    }

    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
      errors.push("JWT_SECRET 应该至少32个字符");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

/**
 * 使用示例：
 *
 * // 生成 token
 * const token = JwtUtils.generateAccessToken(user);
 *
 * // 验证 token
 * try {
 *   const payload = JwtUtils.verifyToken(token);
 *   console.log("用户ID:", payload.userId);
 * } catch (error) {
 *   console.error("Token 验证失败:", error.message);
 * }
 *
 * // 生成完整认证响应
 * const authResponse = JwtUtils.generateAuthResponse(user);
 * res.json(authResponse);
 */
