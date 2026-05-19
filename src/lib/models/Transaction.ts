import mongoose, { Schema, Document } from "mongoose";
import { UnitType } from "./Item";
import { encryptDeterm, decryptDeterm } from "@/lib/encryption";

export type TransactionType = "GİRİŞ" | "ÇIKIŞ";

export interface ITransaction extends Document {
  itemId: string;
  unit: UnitType;
  type: TransactionType;
  quantity: number;
  remainingStock: number;
  date: number;
  personnelId: string;
  description: string;
  documentNo: string;
}

const enc = (val: string) => (val ? encryptDeterm(val) : val);
const dec = (val: string) => (val ? decryptDeterm(val) : val);

const TransactionSchema: Schema = new Schema({
  itemId: { type: String, required: true, set: enc, get: dec },
  unit: { type: String, required: true, set: enc, get: dec },
  type: { type: String, required: true, set: enc, get: dec },
  quantity: { type: Number, required: true },
  remainingStock: { type: Number, required: true },
  date: { type: Number, required: true },
  personnelId: { type: String, required: true, set: enc, get: dec },
  description: { type: String, set: enc, get: dec },
  documentNo: { type: String, required: true, set: enc, get: dec },
});

export default mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);
