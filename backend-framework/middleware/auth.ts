import { Request, Response, NextFunction } from "express";
import { JwtUtils, JwtPayload } from "../utils/jwt";
import { User, IUser } from "../models/User";

/**
 * 扩展 Express Request 接口，添加用户信息
 */
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      payload?: JwtPayload;
    }
  }
}

/**
 * 认证中间件类
 *
 * 提供各种认证和授权中间件
 */
export class AuthMiddleware {
  /**
   * JWT 认证中间件
   * 验证用户身份，将用户信息添加到 request 对象
   */
  static async authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      // 从请求头中提取 token
      const token = JwtUtils.extractTokenFromHeader(req.headers.authorization);

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "未提供认证令牌",
          error: "AUTHENTICATION_REQUIRED",
        });
      }

      // 验证 token
      const payload = JwtUtils.verifyToken(token);

      // 从数据库获取用户信息
      const user = await User.findById(payload.userId);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "用户不存在",
          error: "USER_NOT_FOUND",
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: "用户已被禁用",
          error: "USER_DISABLED",
        });
      }

      // 将用户信息和载荷添加到请求对象
      req.user = user;
      req.payload = payload;

      next();
    } catch (error) {
      const err = error as Error;

      // 根据错误类型返回不同的响应
      if (err.message.includes("过期")) {
        return res.status(401).json({
          success: false,
          message: "认证令牌已过期，请重新登录",
          error: "TOKEN_EXPIRED",
        });
      }

      if (err.message.includes("无效")) {
        return res.status(401).json({
          success: false,
          message: "无效的认证令牌",
          error: "INVALID_TOKEN",
        });
      }

      return res.status(401).json({
        success: false,
        message: "认证失败",
        error: "AUTHENTICATION_FAILED",
      });
    }
  }

  /**
   * 可选认证中间件
   * 如果提供了 token 则验证，否则继续执行
   */
  static async optionalAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const token = JwtUtils.extractTokenFromHeader(req.headers.authorization);

      if (token) {
        // 如果有 token，尝试验证
        const payload = JwtUtils.verifyToken(token);
        const user = await User.findById(payload.userId);

        if (user && user.isActive) {
          req.user = user;
          req.payload = payload;
        }
      }

      // 无论是否认证成功都继续执行
      next();
    } catch (error) {
      // 可选认证失败时不阻止请求继续
      next();
    }
  }

  /**
   * 角色授权中间件
   * 检查用户是否具有指定角色
   */
  static requireRole(...roles: string[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        // 确保用户已认证
        if (!req.user) {
          return res.status(401).json({
            success: false,
            message: "请先登录",
            error: "AUTHENTICATION_REQUIRED",
          });
        }

        // 检查用户角色
        if (!roles.includes(req.user.role)) {
          return res.status(403).json({
            success: false,
            message: "权限不足",
            error: "INSUFFICIENT_PERMISSIONS",
            required: roles,
            current: req.user.role,
          });
        }

        next();
      } catch (error) {
        const err = error as Error;
        return res.status(500).json({
          success: false,
          message: "权限验证失败",
          error: err.message,
        });
      }
    };
  }

  /**
   * 管理员权限中间件
   */
  static requireAdmin = AuthMiddleware.requireRole("admin");

  /**
   * 用户自己或管理员权限中间件
   * 允许用户访问自己的资源，或管理员访问任何资源
   */
  static requireOwnerOrAdmin(userIdParam: string = "id") {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.user) {
          return res.status(401).json({
            success: false,
            message: "请先登录",
            error: "AUTHENTICATION_REQUIRED",
          });
        }

        const targetUserId = req.params[userIdParam];
        const currentUserId = req.user._id.toString();
        const isAdmin = req.user.role === "admin";

        // 管理员可以访问任何资源
        if (isAdmin) {
          return next();
        }

        // 用户只能访问自己的资源
        if (currentUserId === targetUserId) {
          return next();
        }

        return res.status(403).json({
          success: false,
          message: "权限不足，只能访问自己的资源",
          error: "ACCESS_DENIED",
        });
      } catch (error) {
        const err = error as Error;
        return res.status(500).json({
          success: false,
          message: "权限验证失败",
          error: err.message,
        });
      }
    };
  }

  /**
   * 限流中间件（简单实现）
   * 防止暴力破解等攻击
   */
  static rateLimit(
    windowMs: number = 15 * 60 * 1000,
    maxRequests: number = 100
  ) {
    const requests = new Map<string, { count: number; resetTime: number }>();

    return (req: Request, res: Response, next: NextFunction) => {
      const clientId = req.ip || "unknown";
      const now = Date.now();
      const windowStart = now - windowMs;

      // 清理过期记录
      for (const [key, value] of requests.entries()) {
        if (value.resetTime < windowStart) {
          requests.delete(key);
        }
      }

      // 获取或创建客户端记录
      let clientRecord = requests.get(clientId);
      if (!clientRecord) {
        clientRecord = { count: 0, resetTime: now + windowMs };
        requests.set(clientId, clientRecord);
      }

      // 检查是否超出限制
      if (clientRecord.count >= maxRequests) {
        return res.status(429).json({
          success: false,
          message: "请求过于频繁，请稍后再试",
          error: "RATE_LIMIT_EXCEEDED",
          retryAfter: Math.ceil((clientRecord.resetTime - now) / 1000),
        });
      }

      // 增加请求计数
      clientRecord.count++;

      next();
    };
  }

  /**
   * 验证用户状态中间件
   * 确保用户账户处于活跃状态
   */
  static requireActiveUser(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "请先登录",
        error: "AUTHENTICATION_REQUIRED",
      });
    }

    if (!req.user.isActive) {
      return res.status(403).json({
        success: false,
        message: "账户已被禁用，请联系管理员",
        error: "ACCOUNT_DISABLED",
      });
    }

    next();
  }
}

/**
 * 导出常用中间件
 */
export const {
  authenticate,
  optionalAuth,
  requireRole,
  requireAdmin,
  requireOwnerOrAdmin,
  rateLimit,
  requireActiveUser,
} = AuthMiddleware;

/**
 * 使用示例：
 *
 * // 保护需要登录的路由
 * router.get('/protected', authenticate, (req, res) => {
 *   res.json({ user: req.user });
 * });
 *
 * // 需要管理员权限的路由
 * router.get('/admin', authenticate, requireAdmin, (req, res) => {
 *   res.json({ message: '管理员专用' });
 * });
 *
 * // 用户只能访问自己的资源
 * router.get('/users/:id', authenticate, requireOwnerOrAdmin(), (req, res) => {
 *   res.json({ user: req.user });
 * });
 *
 * // 限制登录接口的请求频率
 * router.post('/login', rateLimit(15 * 60 * 1000, 5), loginHandler);
 */
