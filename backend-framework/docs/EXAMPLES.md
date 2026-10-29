# 示例代码使用指南

本项目提供了完整的示例代码，包括数据模型和 API 路由，帮助你快速理解如何创建自己的接口。

## 📁 示例文件说明

### 1. 示例模型

**文件位置**: `models/ExampleModel.ts`

这是一个完整的 Mongoose 模型示例，展示了如何：

- 定义不同的字段类型（String、Number、Boolean、Date、Array、Object）
- 设置字段验证规则（required、min、max）
- 创建索引提高查询性能
- 配置集合名称和时间戳

### 2. 示例路由

**文件位置**: `routes/exampleRoute.ts`

这是一个完整的 RESTful API 示例，展示了如何：

- 实现 CRUD 操作（Create、Read、Update、Delete）
- 处理请求参数和查询条件
- 实现分页功能
- 返回统一的响应格式
- 处理错误情况

## 🚀 如何创建新模型

### 步骤 1: 复制示例文件

```bash
# 复制示例模型文件
cp models/ExampleModel.ts models/YourModel.ts
```

### 步骤 2: 修改模型定义

打开 `models/YourModel.ts`，修改以下内容：

```typescript
import mongoose from "mongoose";

// 1. 修改 Schema 定义
const yourSchema = new mongoose.Schema(
  {
    // 在这里定义你的字段
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // 唯一约束
    },
    // ... 其他字段
  },
  {
    // 2. 修改集合名称
    collection: "your_collection_name",
    timestamps: true,
  }
);

// 3. 创建索引（可选）
yourSchema.index({ email: 1 });

// 4. 修改模型名称
const YourModel = mongoose.model("YourModel", yourSchema);

export { YourModel };
```

### 步骤 3: 在路由中使用

```typescript
import { YourModel } from "../models/YourModel";

// 使用模型
const data = await YourModel.find();
```

## 🚀 如何创建新路由

### 步骤 1: 复制示例文件

```bash
# 复制示例路由文件
cp routes/exampleRoute.ts routes/yourRoute.ts
```

### 步骤 2: 修改路由文件

打开 `routes/yourRoute.ts`，修改以下内容：

```typescript
import express from "express";
import { YourModel } from "../models/YourModel"; // 1. 修改模型导入

const router = express.Router();

// 2. 实现所需的 CRUD 操作
router.get("/", async (req, res) => {
  // GET /api/your-resource
  // 获取所有记录
});

router.get("/:id", async (req, res) => {
  // GET /api/your-resource/:id
  // 获取单条记录
});

router.post("/", async (req, res) => {
  // POST /api/your-resource
  // 创建新记录
});

router.put("/:id", async (req, res) => {
  // PUT /api/your-resource/:id
  // 更新记录
});

router.delete("/:id", async (req, res) => {
  // DELETE /api/your-resource/:id
  // 删除记录
});

export default router;
```

### 步骤 3: 在 index.ts 中注册路由

打开 `index.ts`，添加你的路由：

```typescript
import yourRouter from "./routes/yourRoute";

// 注册路由
app.use("/api/your-resource", yourRouter);
```

## 📋 完整示例：用户管理系统

### 1. 创建用户模型

创建 `models/User.ts`:

```typescript
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    profile: {
      firstName: String,
      lastName: String,
      avatar: String,
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

const User = mongoose.model("User", userSchema);

export { User };
```

### 2. 创建用户路由

创建 `routes/users.ts`:

```typescript
import express from "express";
import { User } from "../models/User";

const router = express.Router();

// 获取所有用户
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, role, isActive } = req.query;

    const query: any = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === "true";

    const skip = (Number(page) - 1) * Number(limit);
    const users = await User.find(query)
      .skip(skip)
      .limit(Number(limit))
      .select("-password"); // 排除密码字段

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "获取用户失败",
      error: (error as Error).message,
    });
  }
});

// 创建用户
router.post("/", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "用户名、邮箱和密码是必填项",
      });
    }

    const user = new User({
      username,
      email,
      password,
      role: role || "user",
    });

    const savedUser = await user.save();

    res.status(201).json({
      success: true,
      message: "用户创建成功",
      data: savedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "创建用户失败",
      error: (error as Error).message,
    });
  }
});

// 获取单个用户
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "用户不存在",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "获取用户失败",
      error: (error as Error).message,
    });
  }
});

// 更新用户
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // 不允许更新密码
    delete updates.password;

    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "用户不存在",
      });
    }

    res.json({
      success: true,
      message: "更新成功",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "更新失败",
      error: (error as Error).message,
    });
  }
});

// 删除用户
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "用户不存在",
      });
    }

    res.json({
      success: true,
      message: "删除成功",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "删除失败",
      error: (error as Error).message,
    });
  }
});

export default router;
```

### 3. 注册路由

在 `index.ts` 中添加：

```typescript
import usersRouter from "./routes/users";

app.use("/api/users", usersRouter);
```

## 🎯 最佳实践

### 1. 字段验证

```typescript
{
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function(v: string) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: "请输入有效的邮箱地址"
    }
  }
}
```

### 2. 索引优化

```typescript
// 单字段索引
schema.index({ email: 1 });

// 复合索引
schema.index({ status: 1, createdAt: -1 });

// 唯一索引
schema.index({ username: 1 }, { unique: true });
```

### 3. 中间件使用

```typescript
// 在保存前执行的中间件
schema.pre("save", function (next) {
  // 执行某些操作
  next();
});

// 在查询前执行的中间件
schema.pre("find", function () {
  this.where({ isDeleted: false });
});
```

### 4. 统一响应格式

```typescript
// 成功响应
{
  success: true,
  message: "操作成功",
  data: { ... }
}

// 失败响应
{
  success: false,
  message: "错误描述",
  error: "详细错误信息"
}
```

### 5. 错误处理

```typescript
try {
  // 业务逻辑
} catch (error) {
  const err = error as Error;
  console.error("操作失败:", err);
  res.status(500).json({
    success: false,
    message: "操作失败",
    error: err.message,
  });
}
```

## 📝 字段类型参考

| 类型       | 说明       | 示例               |
| ---------- | ---------- | ------------------ |
| `String`   | 字符串     | `"Hello World"`    |
| `Number`   | 数字       | `123`              |
| `Boolean`  | 布尔值     | `true` / `false`   |
| `Date`     | 日期       | `new Date()`       |
| `Array`    | 数组       | `[1, 2, 3]`        |
| `Object`   | 对象       | `{ key: "value" }` |
| `Mixed`    | 混合类型   | 任意类型           |
| `ObjectId` | ObjectId   | 关联其他文档       |
| `Buffer`   | 二进制数据 | 文件数据           |

## 🔍 查询方法参考

| 方法                  | 说明             | 示例                                           |
| --------------------- | ---------------- | ---------------------------------------------- |
| `find()`              | 查找所有匹配文档 | `Model.find({ status: "active" })`             |
| `findOne()`           | 查找单个文档     | `Model.findOne({ email: "test@example.com" })` |
| `findById()`          | 根据 ID 查找     | `Model.findById(id)`                           |
| `findOneAndUpdate()`  | 查找并更新       | `Model.findOneAndUpdate(query, update)`        |
| `findByIdAndDelete()` | 根据 ID 删除     | `Model.findByIdAndDelete(id)`                  |
| `create()`            | 创建新文档       | `Model.create({ name: "John" })`               |
| `save()`              | 保存文档         | `user.save()`                                  |
| `deleteOne()`         | 删除单个文档     | `Model.deleteOne({ id })`                      |
| `deleteMany()`        | 删除多个文档     | `Model.deleteMany({ status: "inactive" })`     |
| `countDocuments()`    | 统计文档数量     | `Model.countDocuments({ status: "active" })`   |

## 📚 更多资源

- [Mongoose 官方文档](https://mongoosejs.com/docs/)
- [Express 官方文档](https://expressjs.com/)
- [MongoDB 查询参考](https://docs.mongodb.com/manual/reference/operator/query/)

## 🎓 学习路径

1. **初学者**: 阅读示例代码，理解基本结构
2. **中级**: 创建自己的模型和路由
3. **高级**: 添加验证、中间件、优化查询性能

---

**提示**: 示例代码包含了详细的注释，请仔细阅读以理解每个部分的作用。
