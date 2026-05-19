import mongoose, { Schema, Document } from "mongoose";

export interface IPersonnel extends Document {
  name: string;
  title: string;
  tcNo?: string;
  password?: string;
  email: string;
  role: "super_admin" | "personnel";
  status: "pending" | "approved" | "rejected";
  createdAt: number;
}

const PersonnelSchema: Schema = new Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  tcNo: { type: String },
  password: { type: String },
  email: { type: String, required: true },
  role: {
    type: String,
    enum: ["super_admin", "personnel"],
    default: "personnel",
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Number, required: true, default: () => Date.now() },
});

export default mongoose.models.Personnel ||
  mongoose.model<IPersonnel>("Personnel", PersonnelSchema);
