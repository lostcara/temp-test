import express from "express";
import type { FilterQuery } from "mongoose";
import fs from "fs";
import path from "path";
import multer from "multer";

import SecurityKnowledge, {
  type SecurityKnowledgeDocument,
} from "../models/SecurityKnowledge";
import { applyFuzzySearch } from "../utils/queryHelpers";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

type SecurityKnowledgeStatus = SecurityKnowledgeDocument["status"];

const VALID_STATUSES: SecurityKnowledgeStatus[] = ["待查", "已修复"];

const STATUS_LABEL_MAP: Record<SecurityKnowledgeStatus, string> = {
  待查: "待查",
  已修复: "已修复",
};

const STATUS_COLOR_MAP: Record<SecurityKnowledgeStatus, string> = {
  待查: "#F04438",
  已修复: "#52C41A",
};

const attachStatusMeta = <T extends { status: SecurityKnowledgeStatus }>(
  record: T
) => ({
  ...record,
  statusLabel: STATUS_LABEL_MAP[record.status],
  statusColor: STATUS_COLOR_MAP[record.status],
});

router.get("/", async (req, res) => {
  try {
    const {
      knowledgeNumber,
      knowledgeType,
      address,
      page = "1",
      pageSize = "10",
    } = req.query as Record<string, string | undefined>;

    const pageNum = Math.max(parseInt(page ?? "1", 10) || 1, 1);
    const pageSizeNum = Math.max(parseInt(pageSize ?? "10", 10) || 10, 1);
    const skip = (pageNum - 1) * pageSizeNum;

    const filter: FilterQuery<SecurityKnowledgeDocument> = {};

    // 知识编号模糊查询
    applyFuzzySearch(filter, "knowledgeNumber", knowledgeNumber);

    // 知识类型模糊查询（对应异常类型）
    applyFuzzySearch(filter, "anomalyType", knowledgeType);

    // 获取地址模糊查询（对应详细信息）
    applyFuzzySearch(filter, "detailInfo", address);

    const [list, total] = await Promise.all([
      SecurityKnowledge.find(filter)
        .skip(skip)
        .limit(pageSizeNum)
        .sort({ createdAt: -1 })
        .lean(),
      SecurityKnowledge.countDocuments(filter),
    ]);

    const decoratedList = list.map((record) =>
      attachStatusMeta({
        ...record,
        id: record.id,
      })
    );

    res.json({
      code: 200,
      message: "success",
      data: {
        list: decoratedList,
        pagination: {
          page: pageNum,
          pageSize: pageSizeNum,
          total,
        },
      },
    });
  } catch (error) {
    console.error("获取安全知识列表失败:", error);
    res.status(500).json({
      code: 500,
      message: "获取安全知识列表失败",
      error: (error as Error).message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const knowledge = await SecurityKnowledge.findOne({ id }).lean();

    if (!knowledge) {
      return res.status(404).json({
        code: 404,
        message: "安全知识记录不存在",
      });
    }

    res.json({
      code: 200,
      message: "success",
      data: {
        ...attachStatusMeta({
          ...knowledge,
          id: knowledge.id,
        }),
      },
    });
  } catch (error) {
    console.error("获取安全知识详情失败:", error);
    res.status(500).json({
      code: 500,
      message: "获取安全知识详情失败",
      error: (error as Error).message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    // 移除前端传入的 id，使用后端生成的 id
    const { id, ...knowledgeData } = req.body;
    const knowledge = new SecurityKnowledge(knowledgeData);
    await knowledge.save();

    res.json({
      code: 200,
      message: "创建成功",
      data: {
        ...attachStatusMeta({
          ...knowledge.toObject(),
          id: knowledge.id,
        }),
      },
    });
  } catch (error: any) {
    console.error("创建安全知识记录失败:", error);
    res.status(500).json({
      code: 500,
      message: "创建安全知识记录失败",
      error: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // 移除前端传入的 id，不允许更新 id
    const { id: _, ...knowledgeData } = req.body;
    const knowledge = await SecurityKnowledge.findOneAndUpdate(
      { id },
      knowledgeData,
      { new: true, runValidators: true }
    ).lean();

    if (!knowledge) {
      return res.status(404).json({
        code: 404,
        message: "安全知识记录不存在",
      });
    }

    res.json({
      code: 200,
      message: "更新成功",
      data: {
        ...attachStatusMeta({
          ...knowledge,
          id: knowledge.id,
        }),
      },
    });
  } catch (error) {
    console.error("更新安全知识记录失败:", error);
    res.status(500).json({
      code: 500,
      message: "更新安全知识记录失败",
      error: (error as Error).message,
    });
  }
});

// 导入 JSON 数据到数据库（支持文件上传）
router.post("/import", upload.single("file"), async (req, res) => {
  try {
    let jsonData: any;

    // 如果上传了文件，使用文件内容
    if (req.file) {
      try {
        const fileContent = req.file.buffer.toString("utf-8");
        jsonData = JSON.parse(fileContent);
      } catch (error) {
        return res.status(400).json({
          code: 400,
          message: "JSON 格式错误，请检查文件内容",
          error: (error as Error).message,
        });
      }
    } else {
      // 兼容旧的方式：从文件路径读取
      const { filePath } = req.body;
      const jsonFilePath =
        filePath || path.join(process.cwd(), "data/securityKnowledges.json");

      if (!fs.existsSync(jsonFilePath)) {
        return res.status(404).json({
          code: 404,
          message: "数据文件不存在",
          error: `文件路径: ${jsonFilePath}`,
        });
      }

      const fileContent = fs.readFileSync(jsonFilePath, "utf-8");
      jsonData = JSON.parse(fileContent);
    }

    if (!Array.isArray(jsonData)) {
      return res.status(400).json({
        code: 400,
        message: "数据格式错误，期望数组格式",
      });
    }

    // 批量插入数据（使用 upsert，避免重复）
    const results = {
      total: jsonData.length,
      inserted: 0,
      updated: 0,
      errors: [] as Array<{ knowledgeNumber: string; error: string }>,
    };

    for (const knowledgeData of jsonData) {
      try {
        // 使用 knowledgeNumber 作为唯一标识进行 upsert
        const result = await SecurityKnowledge.findOneAndUpdate(
          { knowledgeNumber: knowledgeData.knowledgeNumber },
          knowledgeData,
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
          }
        );

        if (result.isNew) {
          results.inserted++;
        } else {
          results.updated++;
        }
      } catch (error: any) {
        results.errors.push({
          knowledgeNumber: knowledgeData.knowledgeNumber || "未知",
          error: error.message,
        });
      }
    }

    res.json({
      code: 200,
      message: "导入成功",
      data: results,
    });
  } catch (error) {
    console.error("导入安全知识数据失败:", error);
    res.status(500).json({
      code: 500,
      message: "导入安全知识数据失败",
      error: (error as Error).message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const knowledge = await SecurityKnowledge.findOneAndDelete({ id });

    if (!knowledge) {
      return res.status(404).json({
        code: 404,
        message: "安全知识记录不存在",
      });
    }

    res.json({
      code: 200,
      message: "删除成功",
    });
  } catch (error) {
    console.error("删除安全知识记录失败:", error);
    res.status(500).json({
      code: 500,
      message: "删除安全知识记录失败",
      error: (error as Error).message,
    });
  }
});

router.delete("/", async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        code: 400,
        message: "请提供要删除的安全知识记录ID数组",
      });
    }

    const result = await SecurityKnowledge.deleteMany({ id: { $in: ids } });

    res.json({
      code: 200,
      message: "批量删除成功",
      data: {
        deletedCount: result.deletedCount,
      },
    });
  } catch (error) {
    console.error("批量删除安全知识记录失败:", error);
    res.status(500).json({
      code: 500,
      message: "批量删除安全知识记录失败",
      error: (error as Error).message,
    });
  }
});

export default router;
