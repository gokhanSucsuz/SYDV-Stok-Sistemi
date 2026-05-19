import mongoose, { Schema, Document } from "mongoose";
import { encryptDeterm, decryptDeterm } from "@/lib/encryption";

export type UnitType = "Vefa Temizlik" | "Aşevi" | "Dergah" | "Bağış" | "Vakıf";

export interface ITenderHistory {
  date: number;
  personnelId: string;
  personnelName: string;
  changes: string;
}

export interface IItem extends Document {
  unit: UnitType;
  name: string;
  measurementUnit: string;
  currentStock: number;
  createdAt: number;
  tenderId?: string;
  tenderName?: string;
  tenderEndDate?: number;
  tenderLimit?: number;
  tenderType?: "İhale" | "Bağış";
  tenderHistory?: ITenderHistory[];
  previousTenderStock?: number;
  totalReceived?: number;
}

const enc = (val: string) => (val ? encryptDeterm(val) : val);
const dec = (val: string) => (val ? decryptDeterm(val) : val);

const ItemSchema: Schema = new Schema({
  unit: { type: String, required: true, set: enc, get: dec },
  name: { type: String, required: true, set: enc, get: dec },
  measurementUnit: { type: String, required: true, set: enc, get: dec },
  currentStock: { type: Number, required: true, default: 0 },
  createdAt: { type: Number, required: true, default: () => Date.now() },
  tenderId: { type: String, set: enc, get: dec },
  tenderName: { type: String, set: enc, get: dec },
  tenderEndDate: { type: Number },
  tenderLimit: { type: Number },
  tenderType: { type: String, set: enc, get: dec },
  tenderHistory: [
    {
      date: { type: Number },
      personnelId: { type: String, set: enc, get: dec },
      personnelName: { type: String, set: enc, get: dec },
      changes: { type: String, set: enc, get: dec },
    },
  ],
  previousTenderStock: { type: Number },
  totalReceived: { type: Number, default: 0 },
});

export default mongoose.models.Item ||
  mongoose.model<IItem>("Item", ItemSchema);
