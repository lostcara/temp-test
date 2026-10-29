import express from "express";
import type { FilterQuery } from "mongoose";
import mongoose from "mongoose";
import multer from "multer";
import fs from "fs";
import path from "path";

import AlarmInfo, { type AlarmInfoDocument } from "../models/AlarmInfoModel";
import { applyFuzzySearch } from "../utils/queryHelpers";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

type AlarmInfoStatus = AlarmInfoDocument["status"];

const VALID_STATUSES: AlarmInfoStatus[] = ["pending", "resolved"];

const STATUS_LABEL_MAP: Record<AlarmInfoStatus, string> = {
  pending: "待查",
  resolved: "已修复",
};

const STATUS_COLOR_MAP: Record<AlarmInfoStatus, string> = {
  pending: "#F04438",
  resolved: "#52C41A",
};

const createEmptyStatusSummary = () => ({
  total: 0,
  pending: 0,
  resolved: 0,
});

const attachStatusMeta = <T extends { status: AlarmInfoStatus }>(
  record: T
) => ({
  ...record,
  statusLabel: STATUS_LABEL_MAP[record.status],
  statusColor: STATUS_COLOR_MAP[record.status],
});

const buildStatusSummary = (
  aggregation: Array<{ _id: AlarmInfoStatus; count: number }>
) => {
  return aggregation.reduce((acc, item) => {
    const statusKey = item._id;
    acc[statusKey] = item.count;
    acc.total += item.count;
    return acc;
  }, createEmptyStatusSummary());
};

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

    const filter: FilterQuery<AlarmInfoDocument> = {};

    // 告警单号支持模糊查询
    applyFuzzySearch(filter, "alarmNumber", alarmNumber);

    if (status && VALID_STATUSES.includes(status as AlarmInfoStatus)) {
      filter.status = status as AlarmInfoStatus;
    }

    // 设备名称支持模糊查询
    applyFuzzySearch(filter, "deviceName", deviceName);

    const matchFilter = { ...filter };

    const [list, total, summaryAggregation] = await Promise.all([
      AlarmInfo.find(filter)
        .skip(skip)
        .limit(pageSizeNum)
        .sort({ alarmTime: -1 })
        .lean(),
      AlarmInfo.countDocuments(filter),
      AlarmInfo.aggregate([
        { $match: matchFilter },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const statusSummary = buildStatusSummary(
      summaryAggregation as Array<{ _id: AlarmInfoStatus; count: number }>
    );

    const decoratedList = list.map((record) => {
      return attachStatusMeta({
        ...record,
        id: record.id,
      });
    });

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
        statusSummary,
      },
    });
  } catch (error) {
    console.error("获取告警信息列表失败:", error);
    res.status(500).json({
      code: 500,
      message: "获取告警信息列表失败",
      error: (error as Error).message,
    });
  }
});

router.get("/status/:status", async (req, res) => {
  try {
    const { status } = req.params;

    if (!VALID_STATUSES.includes(status as AlarmInfoStatus)) {
      return res.status(400).json({
        code: 400,
        message: "invalid status value",
      });
    }

    const records = await AlarmInfo.find({ status })
      .sort({ alarmTime: -1 })
      .lean();

    const decorated = records.map((record) => {
      return attachStatusMeta({
        ...record,
        id: record.id,
      });
    });

    res.json({
      code: 200,
      message: "success",
      data: {
        list: decorated,
        status: {
          value: status,
          label: STATUS_LABEL_MAP[status as AlarmInfoStatus],
          color: STATUS_COLOR_MAP[status as AlarmInfoStatus],
          count: decorated.length,
        },
      },
    });
  } catch (error) {
    console.error("按状态获取告警信息失败:", error);
    res.status(500).json({
      code: 500,
      message: "按状态获取告警信息失败",
      error: (error as Error).message,
    });
  }
});

router.get("/statuses/summary", async (_req, res) => {
  try {
    const summaryAggregation = await AlarmInfo.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const statusSummary = buildStatusSummary(
      summaryAggregation as Array<{ _id: AlarmInfoStatus; count: number }>
    );

    res.json({
      code: 200,
      message: "success",
      data: statusSummary,
    });
  } catch (error) {
    console.error("获取告警信息状态汇总失败:", error);
    res.status(500).json({
      code: 500,
      message: "获取告警信息状态汇总失败",
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
        filePath || path.join(process.cwd(), "data/alarms.json");

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

    for (const alarmData of jsonData) {
      try {
        // 移除前端传入的 id，使用后端生成的 id
        const { id, ...dataWithoutId } = alarmData;

        // 使用 alarmNumber 作为唯一标识进行 upsert
        const result = await AlarmInfo.findOneAndUpdate(
          { alarmNumber: alarmData.alarmNumber },
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
          alarmNumber: alarmData.alarmNumber || "未知",
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
    console.error("导入告警信息数据失败:", error);
    res.status(500).json({
      code: 500,
      message: "导入告警信息数据失败",
      error: (error as Error).message,
    });
  }
});

// 删除告警信息
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const alarmInfo = await AlarmInfo.findOneAndDelete({ id });

    if (!alarmInfo) {
      return res.status(404).json({
        code: 404,
        message: "告警信息不存在",
      });
    }

    res.json({
      code: 200,
      message: "删除成功",
    });
  } catch (error) {
    console.error("删除告警信息失败:", error);
    res.status(500).json({
      code: 500,
      message: "删除告警信息失败",
      error: (error as Error).message,
    });
  }
});

// 批量删除告警信息
router.delete("/", async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        code: 400,
        message: "请提供要删除的告警信息ID数组",
      });
    }

    const result = await AlarmInfo.deleteMany({ id: { $in: ids } });

    res.json({
      code: 200,
      message: "批量删除成功",
      data: {
        deletedCount: result.deletedCount,
      },
    });
  } catch (error) {
    console.error("批量删除告警信息失败:", error);
    res.status(500).json({
      code: 500,
      message: "批量删除告警信息失败",
      error: (error as Error).message,
    });
  }
});

export default router;
