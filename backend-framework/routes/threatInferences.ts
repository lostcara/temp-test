import express from "express";
import type { FilterQuery } from "mongoose";
import fs from "fs";
import path from "path";
import multer from "multer";

import ThreatInference, {
  type ThreatInferenceDocument,
} from "../models/ThreatInference";
import { applyFuzzySearch } from "../utils/queryHelpers";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

type ThreatInferenceStatus = ThreatInferenceDocument["status"];

const VALID_STATUSES: ThreatInferenceStatus[] = ["待查", "已修复"];

const STATUS_LABEL_MAP: Record<ThreatInferenceStatus, string> = {
  待查: "待查",
  已修复: "已修复",
};

const STATUS_COLOR_MAP: Record<ThreatInferenceStatus, string> = {
  待查: "#F04438",
  已修复: "#52C41A",
};

const attachStatusMeta = <T extends { status: ThreatInferenceStatus }>(
  record: T
) => ({
  ...record,
  statusLabel: STATUS_LABEL_MAP[record.status],
  statusColor: STATUS_COLOR_MAP[record.status],
});

router.get("/", async (req, res) => {
  try {
    const {
      status,
      alarmNumber,
      deviceName,
      page = "1",
      pageSize = "10",
    } = req.query as Record<string, string | undefined>;

    const pageNum = Math.max(parseInt(page ?? "1", 10) || 1, 1);
    const pageSizeNum = Math.max(parseInt(pageSize ?? "10", 10) || 10, 1);
    const skip = (pageNum - 1) * pageSizeNum;

    const filter: FilterQuery<ThreatInferenceDocument> = {};

    // 告警单号支持模糊查询
    applyFuzzySearch(filter, "alarmNumber", alarmNumber);

    if (status && VALID_STATUSES.includes(status as ThreatInferenceStatus)) {
      filter.status = status as ThreatInferenceStatus;
    }

    // 设备名称支持模糊查询
    applyFuzzySearch(filter, "deviceName", deviceName);

    const [list, total] = await Promise.all([
      ThreatInference.find(filter)
        .skip(skip)
        .limit(pageSizeNum)
        .sort({ alarmTime: -1 })
        .lean(),
      ThreatInference.countDocuments(filter),
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
    console.error("获取威胁推理列表失败:", error);
    res.status(500).json({
      code: 500,
      message: "获取威胁推理列表失败",
      error: (error as Error).message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const threatInference = await ThreatInference.findOne({ id }).lean();

    if (!threatInference) {
      return res.status(404).json({
        code: 404,
        message: "威胁推理记录不存在",
      });
    }

    res.json({
      code: 200,
      message: "success",
      data: {
        ...attachStatusMeta({
          ...threatInference,
          id: threatInference.id,
        }),
      },
    });
  } catch (error) {
    console.error("获取威胁推理详情失败:", error);
    res.status(500).json({
      code: 500,
      message: "获取威胁推理详情失败",
      error: (error as Error).message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    // 移除前端传入的 id，使用后端生成的 id
    const { id, ...threatInferenceData } = req.body;
    const threatInference = new ThreatInference(threatInferenceData);
    await threatInference.save();

    res.json({
      code: 200,
      message: "创建成功",
      data: {
        ...attachStatusMeta({
          ...threatInference.toObject(),
          id: threatInference.id,
        }),
      },
    });
  } catch (error: any) {
    console.error("创建威胁推理记录失败:", error);
    res.status(500).json({
      code: 500,
      message: "创建威胁推理记录失败",
      error: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // 移除前端传入的 id，不允许更新 id
    const { id: _, ...threatInferenceData } = req.body;
    const threatInference = await ThreatInference.findOneAndUpdate(
      { id },
      threatInferenceData,
      { new: true, runValidators: true }
    ).lean();

    if (!threatInference) {
      return res.status(404).json({
        code: 404,
        message: "威胁推理记录不存在",
      });
    }

    res.json({
      code: 200,
      message: "更新成功",
      data: {
        ...attachStatusMeta({
          ...threatInference,
          id: threatInference.id,
        }),
      },
    });
  } catch (error) {
    console.error("更新威胁推理记录失败:", error);
    res.status(500).json({
      code: 500,
      message: "更新威胁推理记录失败",
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
        filePath || path.join(process.cwd(), "data/threatInferences.json");

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
      errors: [] as Array<{ alarmNumber: string; error: string }>,
    };

    for (const threatInferenceData of jsonData) {
      try {
        // 移除前端传入的 id，使用后端生成的 id
        const { id, ...dataWithoutId } = threatInferenceData;

        // 使用 alarmNumber 作为唯一标识进行 upsert
        const result = await ThreatInference.findOneAndUpdate(
          { alarmNumber: threatInferenceData.alarmNumber },
          dataWithoutId,
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
          alarmNumber: threatInferenceData.alarmNumber || "未知",
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
    console.error("导入威胁推理数据失败:", error);
    res.status(500).json({
      code: 500,
      message: "导入威胁推理数据失败",
      error: (error as Error).message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const threatInference = await ThreatInference.findOneAndDelete({ id });

    if (!threatInference) {
      return res.status(404).json({
        code: 404,
        message: "威胁推理记录不存在",
      });
    }

    res.json({
      code: 200,
      message: "删除成功",
    });
  } catch (error) {
    console.error("删除威胁推理记录失败:", error);
    res.status(500).json({
      code: 500,
      message: "删除威胁推理记录失败",
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
        message: "请提供要删除的威胁推理记录ID数组",
      });
    }

    const result = await ThreatInference.deleteMany({ id: { $in: ids } });

    res.json({
      code: 200,
      message: "批量删除成功",
      data: {
        deletedCount: result.deletedCount,
      },
    });
  } catch (error) {
    console.error("批量删除威胁推理记录失败:", error);
    res.status(500).json({
      code: 500,
      message: "批量删除威胁推理记录失败",
      error: (error as Error).message,
    });
  }
});

export default router;
