import { Schema, model, type Document } from "mongoose";
import { generateShortUUID } from "../utils/uuid";

export interface DevicePortraitDocument extends Document {
  id: string;
  deviceName: string;
  deviceNumber: string;
  deviceType: string;
  businessScenario: string;
  portrait: string; // 设备画像描述或ID
  protectionPlan: string; // 防护方案描述或ID
  assetImportance?: number; // 资产重要性
  dataImportance?: number; // 数据重要性
  networkImportance?: number; // 网络重要性
  businessImportance?: number; // 业务重要性
  createdAt: Date;
  updatedAt: Date;
}

const DevicePortraitSchema = new Schema<DevicePortraitDocument>(
  {
    id: {
      type: String,
      unique: true,
      default: generateShortUUID,
      index: true,
    },
    deviceName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    deviceNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    deviceType: {
      type: String,
      required: true,
      trim: true,
    },
    businessScenario: {
      type: String,
      required: true,
      trim: true,
    },
    portrait: {
      type: String,
      default: "",
      trim: true,
    },
    protectionPlan: {
      type: String,
      default: "",
      trim: true,
    },
    assetImportance: {
      type: Number,
      default: undefined,
      min: 0,
      max: 230,
    },
    dataImportance: {
      type: Number,
      default: undefined,
      min: 0,
      max: 230,
    },
    networkImportance: {
      type: Number,
      default: undefined,
      min: 0,
      max: 230,
    },
    businessImportance: {
      type: Number,
      default: undefined,
      min: 0,
      max: 230,
    },
  },
  {
    timestamps: true,
    collection: "device_portraits",
  }
);

// 创建文本索引用于模糊搜索
DevicePortraitSchema.index({
  deviceName: "text",
  deviceNumber: "text",
  businessScenario: "text",
});

const DevicePortrait = model<DevicePortraitDocument>(
  "DevicePortrait",
  DevicePortraitSchema
);

export default DevicePortrait;
