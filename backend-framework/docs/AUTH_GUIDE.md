# 认证系统使用指南

本指南详细介绍如何使用后台管理系统的认证功能，包括用户注册、登录、权限管理和 CRUD 操作示例。

## 📋 目录

- [快速开始](#快速开始)
- [API 接口](#api-接口)
- [认证流程](#认证流程)
- [权限管理](#权限管理)
- [示例代码](#示例代码)
- [最佳实践](#最佳实践)
- [常见问题](#常见问题)

## 🚀 快速开始

### 1. 环境配置

首先确保设置了必要的环境变量。创建 `.env` 文件：

```bash
# 服务器配置
PORT=3000
NODE_ENV=development

# MongoDB 配置
MONGODB_HOST=127.0.0.1
MONGODB_PORT=27017
MONGODB_DATABASE=your_database_name
MONGODB_ENABLE_AUTH=false

# JWT 认证配置（重要：生产环境请修改为复杂密钥）
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动服务

```bash
npm run dev
```

服务启动后，认证接口将在 `http://localhost:3000/api/auth` 可用。

## 📡 API 接口

### 认证接口

| 方法 | 端点                                 | 描述             | 认证要求 |
| ---- | ------------------------------------ | ---------------- | -------- |
| POST | `/api/auth/register`                 | 用户注册         | ❌       |
| POST | `/api/auth/login`                    | 用户登录         | ❌       |
| POST | `/api/auth/refresh`                  | 刷新令牌         | ❌       |
| GET  | `/api/auth/me`                       | 获取当前用户信息 | ✅       |
| PUT  | `/api/auth/profile`                  | 更新用户信息     | ✅       |
| PUT  | `/api/auth/password`                 | 修改密码         | ✅       |
| POST | `/api/auth/logout`                   | 退出登录         | ✅       |
| GET  | `/api/auth/check-username/:username` | 检查用户名可用性 | ❌       |
| GET  | `/api/auth/check-email/:email`       | 检查邮箱可用性   | ❌       |

### 文章管理接口（CRUD 示例）

| 方法   | 端点                        | 描述          | 认证要求          |
| ------ | --------------------------- | ------------- | ----------------- |
| GET    | `/api/articles`             | 获取文章列表  | 🔸 可选           |
| GET    | `/api/articles/hot`         | 获取热门文章  | ❌                |
| GET    | `/api/articles/categories`  | 获取分类列表  | ❌                |
| GET    | `/api/articles/tags`        | 获取标签列表  | ❌                |
| GET    | `/api/articles/:id`         | 获取文章详情  | 🔸 可选           |
| POST   | `/api/articles`             | 创建文章      | ✅                |
| PUT    | `/api/articles/:id`         | 更新文章      | ✅ (作者或管理员) |
| DELETE | `/api/articles/:id`         | 删除文章      | ✅ (作者或管理员) |
| PATCH  | `/api/articles/:id/publish` | 发布文章      | ✅ (作者或管理员) |
| PATCH  | `/api/articles/:id/archive` | 归档文章      | ✅ (作者或管理员) |
| PATCH  | `/api/articles/:id/like`    | 点赞/取消点赞 | ✅                |
| PATCH  | `/api/articles/:id/hot`     | 设置热门文章  | ✅ (管理员)       |

## 🔐 认证流程

### 1. 用户注册

```javascript
const response = await fetch("http://localhost:3000/api/auth/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    username: "john_doe",
    email: "john@example.com",
    password: "securePassword123",
    firstName: "John",
    lastName: "Doe",
    phone: "13800138000",
  }),
});

const data = await response.json();
console.log(data);
// {
//   "success": true,
//   "message": "认证成功",
//   "data": {
//     "user": { ... },
//     "tokens": {
//       "accessToken": "eyJ...",
//       "refreshToken": "eyJ...",
//       "expiresIn": "7d"
//     }
//   }
// }
```

### 2. 用户登录

```javascript
const response = await fetch("http://localhost:3000/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    login: "john@example.com", // 支持邮箱或用户名
    password: "securePassword123",
  }),
});

const data = await response.json();
// 保存 token 到本地存储
localStorage.setItem("accessToken", data.data.tokens.accessToken);
localStorage.setItem("refreshToken", data.data.tokens.refreshToken);
```

### 3. 携带认证令牌访问接口

```javascript
const token = localStorage.getItem("accessToken");

const response = await fetch("http://localhost:3000/api/auth/me", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
```

### 4. 刷新令牌

```javascript
const refreshToken = localStorage.getItem("refreshToken");

const response = await fetch("http://localhost:3000/api/auth/refresh", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    refreshToken: refreshToken,
  }),
});

if (response.ok) {
  const data = await response.json();
  localStorage.setItem("accessToken", data.data.accessToken);
}
```

## 🔑 权限管理

系统支持基于角色的权限控制：

### 用户角色

- **user**: 普通用户（默认）
- **admin**: 管理员

### 权限级别

1. **公开访问**: 无需认证
2. **登录用户**: 需要有效的 JWT token
3. **作者权限**: 只能操作自己创建的资源
4. **管理员权限**: 可以操作所有资源

### 中间件使用

```javascript
import {
  authenticate,
  requireAdmin,
  requireOwnerOrAdmin,
} from "../middleware/auth";

// 需要登录
router.get("/protected", authenticate, handler);

// 需要管理员权限
router.get("/admin-only", authenticate, requireAdmin, handler);

// 用户只能访问自己的资源，或管理员可以访问所有
router.get("/users/:id", authenticate, requireOwnerOrAdmin(), handler);
```

## 💻 示例代码

### 前端集成示例

```javascript
class AuthService {
  constructor() {
    this.baseURL = "http://localhost:3000/api";
    this.token = localStorage.getItem("accessToken");
  }

  // 设置认证头
  getHeaders() {
    const headers = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // 登录
  async login(login, password) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ login, password }),
    });

    const data = await response.json();

    if (data.success) {
      this.token = data.data.tokens.accessToken;
      localStorage.setItem("accessToken", this.token);
      localStorage.setItem("refreshToken", data.data.tokens.refreshToken);
    }

    return data;
  }

  // 获取用户信息
  async getProfile() {
    const response = await fetch(`${this.baseURL}/auth/me`, {
      headers: this.getHeaders(),
    });

    return response.json();
  }

  // 退出登录
  logout() {
    this.token = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
}

// 使用示例
const auth = new AuthService();

// 登录
auth.login("user@example.com", "password123").then((result) => {
  if (result.success) {
    console.log("登录成功");
  }
});
```

### 文章管理示例

```javascript
class ArticleService extends AuthService {
  // 获取文章列表
  async getArticles(params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${this.baseURL}/articles?${query}`, {
      headers: this.getHeaders(),
    });

    return response.json();
  }

  // 创建文章
  async createArticle(articleData) {
    const response = await fetch(`${this.baseURL}/articles`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(articleData),
    });

    return response.json();
  }

  // 更新文章
  async updateArticle(id, articleData) {
    const response = await fetch(`${this.baseURL}/articles/${id}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(articleData),
    });

    return response.json();
  }

  // 删除文章
  async deleteArticle(id) {
    const response = await fetch(`${this.baseURL}/articles/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    return response.json();
  }
}

// 使用示例
const articles = new ArticleService();

// 创建文章
articles
  .createArticle({
    title: "我的第一篇文章",
    content: "文章内容...",
    category: "技术",
    tags: ["Node.js", "MongoDB"],
    status: "draft",
  })
  .then((result) => {
    console.log("文章创建成功:", result);
  });
```

## 🛡️ 最佳实践

### 1. 令牌管理

- **存储**: 使用 `localStorage` 或 `sessionStorage` 存储令牌
- **过期处理**: 监听 401 响应自动刷新令牌
- **安全性**: 生产环境使用 HTTPS

### 2. 错误处理

```javascript
async function makeAuthenticatedRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    if (response.status === 401) {
      // 令牌过期，尝试刷新
      const refreshResult = await refreshToken();
      if (refreshResult.success) {
        // 重试原请求
        return makeAuthenticatedRequest(url, options);
      } else {
        // 刷新失败，跳转到登录页
        window.location.href = "/login";
        return;
      }
    }

    return response.json();
  } catch (error) {
    console.error("请求失败:", error);
    throw error;
  }
}
```

### 3. 权限检查

```javascript
// 检查用户权限
function hasPermission(user, requiredRole) {
  const roleHierarchy = {
    user: 1,
    admin: 2,
  };

  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}

// 条件渲染
function renderAdminButton(user) {
  if (hasPermission(user, "admin")) {
    return "<button>管理员操作</button>";
  }
  return "";
}
```

### 4. 表单验证

```javascript
// 注册表单验证
function validateRegistration(formData) {
  const errors = {};

  if (!formData.username || formData.username.length < 3) {
    errors.username = "用户名至少3个字符";
  }

  if (!formData.email || !formData.email.includes("@")) {
    errors.email = "请输入有效的邮箱地址";
  }

  if (!formData.password || formData.password.length < 6) {
    errors.password = "密码至少6个字符";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
```

## ❓ 常见问题

### Q: 如何处理令牌过期？

A: 系统会在令牌过期时返回 401 状态码。前端应该：

1. 监听 401 响应
2. 使用 refresh token 获取新的 access token
3. 重试原始请求
4. 如果刷新失败，引导用户重新登录

### Q: 如何实现"记住我"功能？

A: 可以通过以下方式实现：

1. 延长 refresh token 的过期时间
2. 使用 `localStorage` 而不是 `sessionStorage`
3. 在应用启动时检查并刷新令牌

### Q: 如何保护管理员接口？

A: 使用 `requireAdmin` 中间件：

```javascript
router.get("/admin/users", authenticate, requireAdmin, getUserList);
```

### Q: 如何实现用户只能编辑自己的资源？

A: 使用 `requireOwnerOrAdmin` 中间件：

```javascript
router.put("/articles/:id", authenticate, requireOwnerOrAdmin(), updateArticle);
```

### Q: 如何防止暴力破解？

A: 系统内置了限流中间件：

```javascript
router.post("/login", rateLimit(15 * 60 * 1000, 5), loginHandler);
```

这将限制每 15 分钟最多 5 次登录尝试。

## 🔗 相关文档

- [项目结构说明](../PROJECT_STRUCTURE.md)
- [快速开始指南](QUICKSTART.md)
- [配置说明](CONFIG.md)
- [示例代码](EXAMPLES.md)

---

📝 **提示**: 这个认证系统提供了完整的用户管理和权限控制功能，可以直接用于生产环境。记得在部署前修改 JWT 密钥和数据库配置。
