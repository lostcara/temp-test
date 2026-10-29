import { Schema, model, type Document } from "mongoose";
import { generateShortUUID } from "../utils/uuid";

export interface SecurityKnowledgeDocument extends Document {
  id: string;
  knowledgeNumber: string; // 知识编号
  businessName: string; // 涉及业务名称
  deviceName: string; // 涉及设备
  deviceType: string; // 设备类型
  deviceModel: string; // 设备型号
  anomalyType: string; // 异常类型
  riskLevel: string; // 风险级别
  status: "待查" | "已修复";
  detailInfo: string; // 详细信息（下载链接或描述）
  statusLabel?: string;
  statusColor?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SecurityKnowledgeSchema = new Schema<SecurityKnowledgeDocument>(
  {
    id: {
      type: String,
      unique: true,
      default: generateShortUUID,
      index: true,
    },
    knowledgeNumber: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    deviceName: {
      type: String,
      required: true,
      trim: true,
    },
    deviceType: {
      type: String,
      required: true,
      trim: true,
    },
    deviceModel: {
      type: String,
      required: true,
      trim: true,
    },
    anomalyType: {
      type: String,
      required: true,
      trim: true,
    },
    riskLevel: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["待查", "已修复"],
      index: true,
    },
    detailInfo: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "security_knowledges",
  }
);

SecurityKnowledgeSchema.index({
  knowledgeNumber: "text",
  deviceName: "text",
  businessName: "text",
});

const SecurityKnowledge = model<SecurityKnowledgeDocument>(
  "SecurityKnowledge",
  SecurityKnowledgeSchema
);

export default SecurityKnowledge;

