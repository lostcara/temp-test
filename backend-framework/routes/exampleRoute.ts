import express from "express";
import { Example } from "../models/ExampleModel";

const router = express.Router();

/**
 * 示例路由文件
 *
 * 这是一个示例路由文件，演示如何创建 Express 路由和 API 端点。
 * 参考此文件创建你自己的路由：
 *
 * 1. 导入 express 和对应的模型
 * 2. 创建 router 实例
 * 3. 定义各种 HTTP 方法的路由
 * 4. 导出 router
 *
 * 使用步骤：
 * 1. 复制此文件并重命名为你的路由名称
 * 2. 修改模型导入以使用你的模型
 * 3. 实现所需的 CRUD 操作
 * 4. 在 index.ts 中注册路由
 */

/**
 * GET /api/examples
 * 获取所有记录（支持分页和筛选）
 */
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, title, isActive } = req.query;

    // 构建查询条件
    const query: any = {};
    if (title) {
      query.title = { $regex: title, $options: "i" }; // 模糊搜索
    }
    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    // 执行查询
    const skip = (Number(page) - 1) * Number(limit);
    const examples = await Example.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    // 获取总数
    const total = await Example.countDocuments(query);

    res.json({
      success: true,
      data: examples,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    const err = error as Error;
    console.error("获取数据失败:", err);
    res.status(500).json({
      success: false,
      message: "获取数据失败",
      error: err.message,
    });
  }
});

/**
 * GET /api/examples/:id
 * 根据 ID 获取单条记录
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const example = await Example.findById(id);

    if (!example) {
      return res.status(404).json({
        success: false,
        message: "记录不存在",
      });
    }

    res.json({
      success: true,
      data: example,
    });
  } catch (error) {
    const err = error as Error;
    console.error("获取数据失败:", err);
    res.status(500).json({
      success: false,
      message: "获取数据失败",
      error: err.message,
    });
  }
});

/**
 * POST /api/examples
 * 创建新记录
 */
router.post("/", async (req, res) => {
  try {
    const { title, description, age, isActive, tags, birthDate } = req.body;

    // 验证必填字段
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "标题是必填项",
      });
    }

    // 创建新记录
    const example = new Example({
      title,
      description: description || "",
      age: age || 0,
      isActive: isActive !== undefined ? isActive : true,
      tags: tags || [],
      birthDate: birthDate || null,
    });

    // 保存到数据库
    const savedExample = await example.save();

    res.status(201).json({
      success: true,
      message: "创建成功",
      data: savedExample,
    });
  } catch (error) {
    const err = error as Error;
    console.error("创建失败:", err);
    res.status(500).json({
      success: false,
      message: "创建失败",
      error: err.message,
    });
  }
});

/**
 * PUT /api/examples/:id
 * 更新记录
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, age, isActive, tags, birthDate } = req.body;

    // 查找记录
    const example = await Example.findById(id);

    if (!example) {
      return res.status(404).json({
        success: false,
        message: "记录不存在",
      });
    }

    // 更新字段
    if (title !== undefined) example.title = title;
    if (description !== undefined) example.description = description;
    if (age !== undefined) example.age = age;
    if (isActive !== undefined) example.isActive = isActive;
    if (tags !== undefined) example.tags = tags;
    if (birthDate !== undefined) example.birthDate = birthDate;
    example.updatedAt = new Date();

    // 保存更新
    const updatedExample = await example.save();

    res.json({
      success: true,
      message: "更新成功",
      data: updatedExample,
    });
  } catch (error) {
    const err = error as Error;
    console.error("更新失败:", err);
    res.status(500).json({
      success: false,
      message: "更新失败",
      error: err.message,
    });
  }
});

/**
 * DELETE /api/examples/:id
 * 删除记录
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const example = await Example.findByIdAndDelete(id);

    if (!example) {
      return res.status(404).json({
        success: false,
        message: "记录不存在",
      });
    }

    res.json({
      success: true,
      message: "删除成功",
      data: example,
    });
  } catch (error) {
    const err = error as Error;
    console.error("删除失败:", err);
    res.status(500).json({
      success: false,
      message: "删除失败",
      error: err.message,
    });
  }
});

/**
 * PATCH /api/examples/:id/activate
 * 示例：自定义操作（激活/停用）
 */
router.patch("/:id/activate", async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const example = await Example.findByIdAndUpdate(
      id,
      { isActive, updatedAt: new Date() },
      { new: true }
    );

    if (!example) {
      return res.status(404).json({
        success: false,
        message: "记录不存在",
      });
    }

    res.json({
      success: true,
      message: `${isActive ? "激活" : "停用"}成功`,
      data: example,
    });
  } catch (error) {
    const err = error as Error;
    console.error("操作失败:", err);
    res.status(500).json({
      success: false,
      message: "操作失败",
      error: err.message,
    });
  }
});

export default router;

/**
 * HTTP 方法说明：
 *
 * GET    - 获取数据（查询）
 * POST   - 创建新资源
 * PUT    - 完整更新资源
 * PATCH  - 部分更新资源
 * DELETE - 删除资源
 *
 * 响应格式建议：
 *
 * 成功响应：
 * {
 *   success: true,
 *   message: "操作成功",
 *   data: { ... }
 * }
 *
 * 失败响应：
 * {
 *   success: false,
 *   message: "错误描述",
 *   error: "详细错误信息"
 * }
 *
 * 常见状态码：
 * 200 - 成功
 * 201 - 创建成功
 * 400 - 请求错误
 * 404 - 资源不存在
 * 500 - 服务器错误
 */
