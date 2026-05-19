import mongoose, { Schema, Document } from "mongoose";
import { encryptDeterm, decryptDeterm } from "@/lib/encryption";

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

const enc = (val: string) => (val ? encryptDeterm(val) : val);
const dec = (val: string) => (val ? decryptDeterm(val) : val);

const PersonnelSchema: Schema = new Schema({
  name: { type: String, required: true, set: enc, get: dec },
  title: { type: String, required: true, set: enc, get: dec },
  tcNo: { type: String, set: enc, get: dec },
  password: { type: String, set: enc, get: dec },
  email: { type: String, required: true, set: enc, get: dec },
  role: {
    type: String,
    default: "personnel",
    set: enc, get: dec
  },
  status: {
    type: String,
    default: "pending",
    set: enc, get: dec
  },
  createdAt: { type: Number, required: true, default: () => Date.now() },
});

export default mongoose.models.Personnel ||
  mongoose.model<IPersonnel>("Personnel", PersonnelSchema);
