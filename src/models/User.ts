import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  phone: string;
  name: string;
  role: "tenant" | "landowner" | "official";
  kycVerified: boolean;
  aadhaarId?: string;
  sazaCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    phone: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["tenant", "landowner", "official"], required: true },
    kycVerified: { type: Boolean, default: false },
    aadhaarId: { type: String },
    sazaCode: { type: String },
  },
  { timestamps: true }
);

// Prevent model recompilation in dev mode
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
