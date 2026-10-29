import { Schema, model, type Document } from "mongoose";
import { generateShortUUID } from "../utils/uuid";

export interface DeviceInfoDocument extends Document {
  id: string;
  deviceName: string;
  deviceNumber: string;
  deviceType: string;
  businessScenario: string;
  securityStatus: "正常" | "过载";
  cpuStatus: "正常" | "过载";
  networkStatus: "正常" | "过载";
  businessStatus: "正常" | "过载";
  createdAt: Date;
  updatedAt: Date;
}

const DeviceInfoSchema = new Schema<DeviceInfoDocument>(
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
    securityStatus: {
      type: String,
      required: true,
      enum: ["正常", "过载"],
      index: true,
    },
    cpuStatus: {
      type: String,
      required: true,
      enum: ["正常", "过载"],
    },
    networkStatus: {
      type: String,
      required: true,
      enum: ["正常", "过载"],
    },
    businessStatus: {
      type: String,
      required: true,
      enum: ["正常", "过载"],
    },
  },
  {
    timestamps: true,
    collection: "device_infos",
  }
);

// 创建文本索引用于模糊搜索
DeviceInfoSchema.index({
  deviceName: "text",
  deviceNumber: "text",
  businessScenario: "text",
});

const DeviceInfo = model<DeviceInfoDocument>("DeviceInfo", DeviceInfoSchema);

export default DeviceInfo;
