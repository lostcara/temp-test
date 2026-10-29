import express from "express";
import { User, IUser } from "../models/User";
import { JwtUtils } from "../utils/jwt";
import { authenticate, rateLimit, requireActiveUser } from "../middleware/auth";

const router = express.Router();

/**
 * 用户注册
 * POST /api/auth/register
 */
router.post("/register", rateLimit(15 * 60 * 1000, 5), async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, phone } = req.body;

    // 验证必填字段
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "用户名、邮箱和密码为必填项",
        error: "MISSING_REQUIRED_FIELDS",
      });
    }

    // 验证密码强度
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "密码至少需要6个字符",
        error: "PASSWORD_TOO_WEAK",
      });
    }

    // 检查用户名是否已存在
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: "用户名已存在",
        error: "USERNAME_EXISTS",
      });
    }

    // 检查邮箱是否已存在
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "邮箱已被注册",
        error: "EMAIL_EXISTS",
      });
    }

    // 创建新用户
    const user = new User({
      username,
      email,
      password,
      profile: {
        firstName: firstName || "",
        lastName: lastName || "",
        phone: phone || "",
      },
    });

    await user.save();

    // 生成认证响应
    const authResponse = JwtUtils.generateAuthResponse(user);

    res.status(201).json(authResponse);
  } catch (error) {
    const err = error as any;
    console.error("用户注册失败:", err);

    // 处理验证错误
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e: any) => e.message);
      return res.status(400).json({
        success: false,
        message: "输入数据验证失败",
        error: "VALIDATION_ERROR",
        details: errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "注册失败，请稍后重试",
      error: "REGISTRATION_FAILED",
    });
  }
});

/**
 * 用户登录
 * POST /api/auth/login
 */
router.post("/login", rateLimit(15 * 60 * 1000, 10), async (req, res) => {
  try {
    const { login, password } = req.body;

    // 验证必填字段
    if (!login || !password) {
      return res.status(400).json({
        success: false,
        message: "请输入用户名/邮箱和密码",
        error: "MISSING_CREDENTIALS",
      });
    }

    // 查找用户（支持用户名或邮箱登录）
    let user: IUser | null;
    if (login.includes("@")) {
      user = await User.findByEmailWithPassword(login);
    } else {
      user = await User.findByUsernameWithPassword(login);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "用户名/邮箱或密码错误",
        error: "INVALID_CREDENTIALS",
      });
    }

    // 验证密码
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "用户名/邮箱或密码错误",
        error: "INVALID_CREDENTIALS",
      });
    }

    // 更新最后登录时间
    user.lastLoginAt = new Date();
    await user.save();

    // 生成认证响应
    const authResponse = JwtUtils.generateAuthResponse(user);

    res.json(authResponse);
  } catch (error) {
    const err = error as Error;
    console.error("用户登录失败:", err);

    res.status(500).json({
      success: false,
      message: "登录失败，请稍后重试",
      error: "LOGIN_FAILED",
    });
  }
});

/**
 * 刷新访问令牌
 * POST /api/auth/refresh
 */
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "未提供刷新令牌",
        error: "MISSING_REFRESH_TOKEN",
      });
    }

    // 验证刷新令牌
    const payload = JwtUtils.verifyToken(refreshToken);

    // 检查是否为刷新令牌
    if ((payload as any).type !== "refresh") {
      return res.status(401).json({
        success: false,
        message: "无效的刷新令牌",
        error: "INVALID_REFRESH_TOKEN",
      });
    }

    // 获取用户信息
    const user = await User.findById(payload.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "用户不存在或已被禁用",
        error: "USER_NOT_FOUND",
      });
    }

    // 生成新的访问令牌
    const newAccessToken = JwtUtils.generateAccessToken(user);

    res.json({
      success: true,
      message: "令牌刷新成功",
      data: {
        accessToken: newAccessToken,
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      },
    });
  } catch (error) {
    const err = error as Error;
    console.error("令牌刷新失败:", err);

    if (err.message.includes("过期")) {
      return res.status(401).json({
        success: false,
        message: "刷新令牌已过期，请重新登录",
        error: "REFRESH_TOKEN_EXPIRED",
      });
    }

    res.status(401).json({
      success: false,
      message: "令牌刷新失败",
      error: "REFRESH_FAILED",
    });
  }
});

/**
 * 获取当前用户信息
 * GET /api/auth/me
 */
router.get("/me", authenticate, (req, res) => {
  try {
    res.json({
      success: true,
      message: "获取用户信息成功",
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    const err = error as Error;
    console.error("获取用户信息失败:", err);

    res.status(500).json({
      success: false,
      message: "获取用户信息失败",
      error: err.message,
    });
  }
});

/**
 * 更新用户信息
 * PUT /api/auth/profile
 */
router.put("/profile", authenticate, requireActiveUser, async (req, res) => {
  try {
    const { firstName, lastName, phone, avatar } = req.body;
    const user = req.user!;

    // 更新用户信息
    if (firstName !== undefined) user.profile.firstName = firstName;
    if (lastName !== undefined) user.profile.lastName = lastName;
    if (phone !== undefined) user.profile.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.json({
      success: true,
      message: "用户信息更新成功",
      data: {
        user: user,
      },
    });
  } catch (error) {
    const err = error as any;
    console.error("更新用户信息失败:", err);

    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e: any) => e.message);
      return res.status(400).json({
        success: false,
        message: "输入数据验证失败",
        error: "VALIDATION_ERROR",
        details: errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "更新用户信息失败",
      error: "UPDATE_FAILED",
    });
  }
});

/**
 * 修改密码
 * PUT /api/auth/password
 */
router.put("/password", authenticate, requireActiveUser, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user!;

    // 验证必填字段
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "当前密码和新密码为必填项",
        error: "MISSING_PASSWORDS",
      });
    }

    // 验证新密码强度
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "新密码至少需要6个字符",
        error: "PASSWORD_TOO_WEAK",
      });
    }

    // 获取包含密码的用户信息
    const userWithPassword = await User.findById(user._id).select("+password");
    if (!userWithPassword) {
      return res.status(404).json({
        success: false,
        message: "用户不存在",
        error: "USER_NOT_FOUND",
      });
    }

    // 验证当前密码
    const isCurrentPasswordValid = await userWithPassword.comparePassword(
      currentPassword
    );
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "当前密码错误",
        error: "INVALID_CURRENT_PASSWORD",
      });
    }

    // 更新密码
    userWithPassword.password = newPassword;
    await userWithPassword.save();

    res.json({
      success: true,
      message: "密码修改成功",
    });
  } catch (error) {
    const err = error as Error;
    console.error("修改密码失败:", err);

    res.status(500).json({
      success: false,
      message: "修改密码失败",
      error: "PASSWORD_CHANGE_FAILED",
    });
  }
});

/**
 * 退出登录（客户端处理）
 * POST /api/auth/logout
 */
router.post("/logout", authenticate, (req, res) => {
  // 由于使用的是无状态 JWT，服务端无需处理退出逻辑
  // 客户端只需删除存储的 token 即可
  res.json({
    success: true,
    message: "退出登录成功",
  });
});

/**
 * 验证用户名是否可用
 * GET /api/auth/check-username/:username
 */
router.get("/check-username/:username", async (req, res) => {
  try {
    const { username } = req.params;

    if (!username || username.length < 3) {
      return res.status(400).json({
        success: false,
        message: "用户名至少需要3个字符",
        error: "INVALID_USERNAME",
      });
    }

    const existingUser = await User.findOne({ username });

    res.json({
      success: true,
      data: {
        available: !existingUser,
      },
    });
  } catch (error) {
    const err = error as Error;
    console.error("检查用户名失败:", err);

    res.status(500).json({
      success: false,
      message: "检查用户名失败",
      error: "CHECK_FAILED",
    });
  }
});

/**
 * 验证邮箱是否可用
 * GET /api/auth/check-email/:email
 */
router.get("/check-email/:email", async (req, res) => {
  try {
    const { email } = req.params;

    if (!email || !email.includes("@")) {
      return res.status(400).json({
        success: false,
        message: "邮箱格式无效",
        error: "INVALID_EMAIL",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    res.json({
      success: true,
      data: {
        available: !existingUser,
      },
    });
  } catch (error) {
    const err = error as Error;
    console.error("检查邮箱失败:", err);

    res.status(500).json({
      success: false,
      message: "检查邮箱失败",
      error: "CHECK_FAILED",
    });
  }
});

export default router;

/**
 * API 端点说明：
 *
 * POST   /api/auth/register         - 用户注册
 * POST   /api/auth/login            - 用户登录
 * POST   /api/auth/refresh          - 刷新访问令牌
 * GET    /api/auth/me               - 获取当前用户信息
 * PUT    /api/auth/profile          - 更新用户信息
 * PUT    /api/auth/password         - 修改密码
 * POST   /api/auth/logout           - 退出登录
 * GET    /api/auth/check-username/:username - 检查用户名是否可用
 * GET    /api/auth/check-email/:email       - 检查邮箱是否可用
 */
