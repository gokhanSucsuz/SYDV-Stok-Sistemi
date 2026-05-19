import mongoose, { Schema, Document } from "mongoose";
import { encryptDeterm, decryptDeterm } from "@/lib/encryption";

export interface IMasterItem extends Document {
  name: string;
  measurementUnit: string;
  itemCode?: string;
  category?: string;
  criticalStockLevel?: number;
  storageConditions?: string;
  barcode?: string;
  description?: string;
  createdAt: number;
}

const enc = (val: string) => (val ? encryptDeterm(val) : val);
const dec = (val: string) => (val ? decryptDeterm(val) : val);

const MasterItemSchema: Schema = new Schema({
  name: { type: String, required: true, set: enc, get: dec },
  measurementUnit: { type: String, required: true, set: enc, get: dec },
  itemCode: { type: String, set: enc, get: dec },
  category: { type: String, set: enc, get: dec },
  criticalStockLevel: { type: Number },
  storageConditions: { type: String, set: enc, get: dec },
  barcode: { type: String, set: enc, get: dec },
  description: { type: String, set: enc, get: dec },
  createdAt: { type: Number, required: true, default: () => Date.now() },
});

export default mongoose.models.MasterItem ||
  mongoose.model<IMasterItem>("MasterItem", MasterItemSchema);
