import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

/**
 * 用户接口定义
 */
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role: "user" | "admin";
  isActive: boolean;
  avatar?: string;
  profile: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  // 虚拟字段
  readonly fullName?: string;

  // 实例方法
  comparePassword(candidatePassword: string): Promise<boolean>;
  toJSON(): any;
}

/**
 * 用户模型静态方法接口
 */
export interface IUserModel extends mongoose.Model<IUser> {
  findActiveUsers(): mongoose.Query<IUser[], IUser>;
  findByEmailWithPassword(email: string): mongoose.Query<IUser | null, IUser>;
  findByUsernameWithPassword(
    username: string
  ): mongoose.Query<IUser | null, IUser>;
}

/**
 * 用户数据模型
 *
 * 功能特性：
 * - 密码自动加密（保存前）
 * - 密码验证方法
 * - 角色管理（用户/管理员）
 * - 用户状态管理
 * - 个人信息扩展
 */
const userSchema = new Schema<IUser>(
  {
    // 基本信息
    username: {
      type: String,
      required: [true, "用户名不能为空"],
      unique: true,
      trim: true,
      minlength: [3, "用户名至少3个字符"],
      maxlength: [30, "用户名不能超过30个字符"],
      match: [/^[a-zA-Z0-9_]+$/, "用户名只能包含字母、数字和下划线"],
    },

    email: {
      type: String,
      required: [true, "邮箱不能为空"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "请输入有效的邮箱地址"],
    },

    password: {
      type: String,
      required: [true, "密码不能为空"],
      minlength: [6, "密码至少6个字符"],
      select: false, // 默认查询时不返回密码字段
    },

    // 用户角色
    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: "角色必须是 user 或 admin",
      },
      default: "user",
    },

    // 用户状态
    isActive: {
      type: Boolean,
      default: true,
    },

    // 头像
    avatar: {
      type: String,
      default: null,
    },

    // 扩展信息
    profile: {
      firstName: {
        type: String,
        trim: true,
        maxlength: [50, "姓名不能超过50个字符"],
      },
      lastName: {
        type: String,
        trim: true,
        maxlength: [50, "姓名不能超过50个字符"],
      },
      phone: {
        type: String,
        trim: true,
        match: [/^[1][3-9]\d{9}$/, "请输入有效的手机号码"],
      },
    },

    // 最后登录时间
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // 自动添加 createdAt 和 updatedAt
    collection: "users", // 指定集合名称
  }
);

// 创建复合索引
userSchema.index({ email: 1, isActive: 1 });
userSchema.index({ username: 1, isActive: 1 });

/**
 * 中间件：保存前自动加密密码
 */
userSchema.pre("save", async function (next) {
  // 只有密码被修改时才重新加密
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // 生成盐值并加密密码
    const salt = await bcrypt.genSalt(12);
    (this as any).password = await bcrypt.hash((this as any).password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

/**
 * 实例方法：验证密码
 */
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, (this as any).password);
  } catch (error) {
    throw new Error("密码验证失败");
  }
};

/**
 * 实例方法：自定义 JSON 序列化（移除敏感信息）
 */
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();

  // 移除敏感字段
  delete userObject.password;
  delete userObject.__v;

  return userObject;
};

/**
 * 静态方法：查找活跃用户
 */
userSchema.statics.findActiveUsers = function () {
  return this.find({ isActive: true });
};

/**
 * 静态方法：根据邮箱查找用户（包含密码）
 */
userSchema.statics.findByEmailWithPassword = function (email: string) {
  return this.findOne({ email, isActive: true }).select("+password");
};

/**
 * 静态方法：根据用户名查找用户（包含密码）
 */
userSchema.statics.findByUsernameWithPassword = function (username: string) {
  return this.findOne({ username, isActive: true }).select("+password");
};

/**
 * 虚拟字段：全名
 */
userSchema.virtual("fullName").get(function (this: IUser) {
  if (this.profile.firstName && this.profile.lastName) {
    return `${this.profile.firstName} ${this.profile.lastName}`;
  }
  return this.username;
});

// 确保虚拟字段在 JSON 中显示
userSchema.set("toJSON", { virtuals: true });

/**
 * 导出用户模型
 */
const User = mongoose.model<IUser, IUserModel>("User", userSchema);

export { User };

/**
 * 使用示例：
 *
 * // 创建用户
 * const user = new User({
 *   username: "john_doe",
 *   email: "john@example.com",
 *   password: "securePassword123",
 *   profile: {
 *     firstName: "John",
 *     lastName: "Doe"
 *   }
 * });
 * await user.save();
 *
 * // 验证密码
 * const isValidPassword = await user.comparePassword("securePassword123");
 *
 * // 查找用户（不包含密码）
 * const users = await User.find({ isActive: true });
 *
 * // 查找用户（包含密码，用于登录验证）
 * const userWithPassword = await User.findByEmailWithPassword("john@example.com");
 */
