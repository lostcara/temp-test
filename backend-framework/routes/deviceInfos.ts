import express from "express";
import type { FilterQuery } from "mongoose";
import fs from "fs";
import path from "path";
import multer from "multer";

import DeviceInfo, { type DeviceInfoDocument } from "../models/DeviceInfoModel";
import { applyFuzzySearch } from "../utils/queryHelpers";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

type DeviceInfoStatus = DeviceInfoDocument["securityStatus"];

const VALID_STATUSES: DeviceInfoStatus[] = ["正常", "过载"];

router.get("/", async (req, res) => {
  try {
    const {
      status,
      deviceName,
      deviceNumber,
      page = "1",
      pageSize = "10",
    } = req.query as Record<string, string | undefined>;

    const pageNum = Math.max(parseInt(page ?? "1", 10) || 1, 1);
    const pageSizeNum = Math.max(parseInt(pageSize ?? "10", 10) || 10, 1);
    const skip = (pageNum - 1) * pageSizeNum;

    const filter: FilterQuery<DeviceInfoDocument> = {};

    // 设备名称模糊查询
    applyFuzzySearch(filter, "deviceName", deviceName);

    // 设备编号模糊查询
    applyFuzzySearch(filter, "deviceNumber", deviceNumber);

    // 状态筛选（支持安全状态、CPU状态、网络状态、业务状态）
    if (status && VALID_STATUSES.includes(status as DeviceInfoStatus)) {
      filter.$or = [
        { securityStatus: status },
        { cpuStatus: status },
        { networkStatus: status },
        { businessStatus: status },
      ];
    }

    const [list, total] = await Promise.all([
      DeviceInfo.find(filter)
        .skip(skip)
        .limit(pageSizeNum)
        .sort({ createdAt: -1 })
        .lean(),
      DeviceInfo.countDocuments(filter),
    ]);

    const decoratedList = list.map((record) => ({
      ...record,
      id: record.id,
    }));

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
    console.error("获取设备信息列表失败:", error);
    res.status(500).json({
      code: 500,
      message: "获取设备信息列表失败",
      error: (error as Error).message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deviceInfo = await DeviceInfo.findOne({ id }).lean();

    if (!deviceInfo) {
      return res.status(404).json({
        code: 404,
        message: "设备信息不存在",
      });
    }

    res.json({
      code: 200,
      message: "success",
      data: {
        ...deviceInfo,
        id: deviceInfo.id,
      },
    });
  } catch (error) {
    console.error("获取设备信息详情失败:", error);
    res.status(500).json({
      code: 500,
      message: "获取设备信息详情失败",
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
        filePath || path.join(process.cwd(), "data/devices.json");

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
      errors: [] as Array<{ deviceNumber: string; error: string }>,
    };

    for (const deviceData of jsonData) {
      try {
        // 使用 deviceNumber 作为唯一标识进行 upsert
        const result = await DeviceInfo.findOneAndUpdate(
          { deviceNumber: deviceData.deviceNumber },
          deviceData,
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
          deviceNumber: deviceData.deviceNumber || "未知",
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
    console.error("导入设备信息数据失败:", error);
    res.status(500).json({
      code: 500,
      message: "导入设备信息数据失败",
      error: (error as Error).message,
    });
  }
});

// 删除设备信息
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deviceInfo = await DeviceInfo.findOneAndDelete({ id });

    if (!deviceInfo) {
      return res.status(404).json({
        code: 404,
        message: "设备信息不存在",
      });
    }

    res.json({
      code: 200,
      message: "删除成功",
    });
  } catch (error) {
    console.error("删除设备信息失败:", error);
    res.status(500).json({
      code: 500,
      message: "删除设备信息失败",
      error: (error as Error).message,
    });
  }
});

// 批量删除设备信息
router.delete("/", async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        code: 400,
        message: "请提供要删除的设备信息ID数组",
      });
    }

    const result = await DeviceInfo.deleteMany({ id: { $in: ids } });

    res.json({
      code: 200,
      message: "批量删除成功",
      data: {
        deletedCount: result.deletedCount,
      },
    });
  } catch (error) {
    console.error("批量删除设备信息失败:", error);
    res.status(500).json({
      code: 500,
      message: "批量删除设备信息失败",
      error: (error as Error).message,
    });
  }
});

export default router;
