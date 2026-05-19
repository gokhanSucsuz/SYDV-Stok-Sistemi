import mongoose, { Schema, Document } from "mongoose";

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

const MasterItemSchema: Schema = new Schema({
  name: { type: String, required: true },
  measurementUnit: { type: String, required: true },
  itemCode: { type: String },
  category: { type: String },
  criticalStockLevel: { type: Number },
  storageConditions: { type: String },
  barcode: { type: String },
  description: { type: String },
  createdAt: { type: Number, required: true, default: () => Date.now() },
});

export default mongoose.models.MasterItem ||
  mongoose.model<IMasterItem>("MasterItem", MasterItemSchema);
