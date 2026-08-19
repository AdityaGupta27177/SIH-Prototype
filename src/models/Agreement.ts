import mongoose, { Schema, Document, Model } from "mongoose";

export type AgreementStatus =
  | "PENDING_LANDOWNER_CONSENT"
  | "OWNER_APPROVED"
  | "OWNER_REJECTED"
  | "OFFICIALLY_VERIFIED";

export interface IAgreement extends Document {
  dtvnId: string;
  // Tenant info
  tenantPhone: string;
  tenantName: string;
  // Landowner info
  landownerPhone: string;
  // Land details
  gatNumber: string;
  district: string;
  taluka: string;
  village: string;
  // Crop & tenure
  cropCategory: string;
  leaseTenure: string; // e.g. "Kharif 2026", "1 Year"
  // GPS coordinates (where the tenant dropped the pin)
  gpsLat: number;
  gpsLng: number;
  // Status tracking
  status: AgreementStatus;
  rejectionReason?: string;
  rejectionCount: number;
  // Blockchain anchoring
  recordHash?: string;
  salt?: string;
  txHash?: string;
  blockNumber?: number;
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const AgreementSchema = new Schema<IAgreement>(
  {
    dtvnId: { type: String, required: true, unique: true, index: true },
    tenantPhone: { type: String, required: true },
    tenantName: { type: String, required: true },
    landownerPhone: { type: String, required: true },
    gatNumber: { type: String, required: true },
    district: { type: String, required: true },
    taluka: { type: String, required: true },
    village: { type: String, required: true },
    cropCategory: { type: String, required: true },
    leaseTenure: { type: String, required: true },
    gpsLat: { type: Number, required: true },
    gpsLng: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        "PENDING_LANDOWNER_CONSENT",
        "OWNER_APPROVED",
        "OWNER_REJECTED",
        "OFFICIALLY_VERIFIED",
      ],
      default: "PENDING_LANDOWNER_CONSENT",
    },
    rejectionReason: { type: String },
    rejectionCount: { type: Number, default: 0 },
    recordHash: { type: String },
    salt: { type: String },
    txHash: { type: String },
    blockNumber: { type: Number },
  },
  { timestamps: true }
);

const Agreement: Model<IAgreement> =
  mongoose.models.Agreement ||
  mongoose.model<IAgreement>("Agreement", AgreementSchema);

export default Agreement;
