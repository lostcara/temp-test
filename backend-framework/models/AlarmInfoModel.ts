import { Schema, model, type Document } from "mongoose";
import { generateShortUUID } from "../utils/uuid";

export interface AlarmInfoDocument extends Document {
  id: string;
  alarmNumber: string;
  businessName: string;
  deviceName: string;
  deviceType: string;
  deviceModel: string;
  anomalyType: string;
  riskLevel: string;
  alarmTime: string;
  status: "pending" | "resolved";
  statusLabel?: string;
  statusColor?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AlarmInfoSchema = new Schema<AlarmInfoDocument>(
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
      enum: ["pending", "resolved"],
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "alarm_infos",
  }
);

AlarmInfoSchema.index({ deviceName: "text", businessName: "text" });

const AlarmInfo = model<AlarmInfoDocument>("AlarmInfo", AlarmInfoSchema);

export default AlarmInfo;
