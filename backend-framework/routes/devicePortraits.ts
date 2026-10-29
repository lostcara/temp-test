import express from "express";
import type { FilterQuery } from "mongoose";
import fs from "fs";
import path from "path";
import multer from "multer";

import DevicePortrait, {
  type DevicePortraitDocument,
} from "../models/DevicePortrait";
import { applyFuzzySearch } from "../utils/queryHelpers";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const {
      deviceName,
      deviceNumber,
      page = "1",
      pageSize = "10",
    } = req.query as Record<string, string | undefined>;

    const pageNum = Math.max(parseInt(page ?? "1", 10) || 1, 1);
    const pageSizeNum = Math.max(parseInt(pageSize ?? "10", 10) || 10, 1);
    const skip = (pageNum - 1) * pageSizeNum;

    const filter: FilterQuery<DevicePortraitDocument> = {};

    // 设备名称模糊查询
    applyFuzzySearch(filter, "deviceName", deviceName);

    // 设备编号模糊查询
    applyFuzzySearch(filter, "deviceNumber", deviceNumber);

    const [list, total] = await Promise.all([
      DevicePortrait.find(filter)
        .skip(skip)
        .limit(pageSizeNum)
        .sort({ createdAt: -1 })
        .lean(),
      DevicePortrait.countDocuments(filter),
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
    console.error("获取设备画像列表失败:", error);
    res.status(500).json({
      code: 500,
      message: "获取设备画像列表失败",
      error: (error as Error).message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const portrait = await DevicePortrait.findOne({ id }).lean();

    if (!portrait) {
      return res.status(404).json({
        code: 404,
        message: "设备画像不存在",
      });
    }

    res.json({
      code: 200,
      message: "success",
      data: {
        ...portrait,
        id: portrait.id,
      },
    });
  } catch (error) {
    console.error("获取设备画像详情失败:", error);
    res.status(500).json({
      code: 500,
      message: "获取设备画像详情失败",
      error: (error as Error).message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    // 移除前端传入的 id，使用后端生成的 id
    const { id, ...portraitData } = req.body;
    const portrait = new DevicePortrait(portraitData);
    await portrait.save();

    res.json({
      code: 200,
      message: "创建成功",
      data: {
        ...portrait.toObject(),
        id: portrait.id,
      },
    });
  } catch (error: any) {
    console.error("创建设备画像失败:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        code: 400,
        message: "设备编号已存在",
      });
    }
    res.status(500).json({
      code: 500,
      message: "创建设备画像失败",
      error: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // 移除前端传入的 id，不允许更新 id
    const { id: _, ...portraitData } = req.body;
    const portrait = await DevicePortrait.findOneAndUpdate(
      { id },
      portraitData,
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!portrait) {
      return res.status(404).json({
        code: 404,
        message: "设备画像不存在",
      });
    }

    res.json({
      code: 200,
      message: "更新成功",
      data: {
        ...portrait,
        id: portrait.id,
      },
    });
  } catch (error) {
    console.error("更新设备画像失败:", error);
    res.status(500).json({
      code: 500,
      message: "更新设备画像失败",
      error: (error as Error).message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const portrait = await DevicePortrait.findOneAndDelete({ id });

    if (!portrait) {
      return res.status(404).json({
        code: 404,
        message: "设备画像不存在",
      });
    }

    res.json({
      code: 200,
      message: "删除成功",
    });
  } catch (error) {
    console.error("删除设备画像失败:", error);
    res.status(500).json({
      code: 500,
      message: "删除设备画像失败",
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
        message: "请提供要删除的设备画像ID数组",
      });
    }

    const result = await DevicePortrait.deleteMany({ id: { $in: ids } });

    res.json({
      code: 200,
      message: "批量删除成功",
      data: {
        deletedCount: result.deletedCount,
      },
    });
  } catch (error) {
    console.error("批量删除设备画像失败:", error);
    res.status(500).json({
      code: 500,
      message: "批量删除设备画像失败",
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
        filePath || path.join(process.cwd(), "data/devicePortraits.json");

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

    for (const portraitData of jsonData) {
      try {
        // 移除前端传入的 id，使用后端生成的 id
        const { id, ...dataWithoutId } = portraitData;

        // 使用 deviceNumber 作为唯一标识进行 upsert
        const result = await DevicePortrait.findOneAndUpdate(
          { deviceNumber: portraitData.deviceNumber },
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
          deviceNumber: portraitData.deviceNumber || "未知",
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
    console.error("导入设备画像数据失败:", error);
    res.status(500).json({
      code: 500,
      message: "导入设备画像数据失败",
      error: (error as Error).message,
    });
  }
});

export default router;
