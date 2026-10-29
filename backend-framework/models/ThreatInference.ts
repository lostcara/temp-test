import { Schema, model, type Document } from "mongoose";
import { generateShortUUID } from "../utils/uuid";

export interface ThreatInferenceDocument extends Document {
  id: string;
  alarmNumber: string;
  businessName: string;
  deviceName: string;
  deviceType: string;
  deviceModel: string;
  anomalyType: string;
  riskLevel: string;
  alarmTime: string;
  status: "待查" | "已修复";
  statusLabel?: string;
  statusColor?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ThreatInferenceSchema = new Schema<ThreatInferenceDocument>(
  {
    id: {
      type: String,
      unique: true,
      default: generateShortUUID,
      index: true,
    },
    alarmNumber: {
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
    alarmTime: {
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
  },
  {
    timestamps: true,
    collection: "threat_inferences",
  }
);

ThreatInferenceSchema.index({
  deviceName: "text",
  businessName: "text",
  alarmNumber: "text",
});

const ThreatInference = model<ThreatInferenceDocument>(
  "ThreatInference",
  ThreatInferenceSchema
);

export default ThreatInference;
