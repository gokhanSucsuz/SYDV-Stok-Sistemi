import mongoose, { Schema, Document } from "mongoose";
import { encryptDeterm, decryptDeterm } from "@/lib/encryption";

export interface IBackup extends Document {
  fileName: string;
  createdAt: number;
  data?: any;
  type?: string;
  status?: string;
  size?: string;
}

const enc = (val: string) => (val ? encryptDeterm(val) : val);
const dec = (val: string) => (val ? decryptDeterm(val) : val);

const BackupSchema: Schema = new Schema({
  fileName: { type: String, required: true, set: enc, get: dec },
  createdAt: { type: Number, required: true, default: () => Date.now() },
  type: { type: String, set: enc, get: dec },
  status: { type: String, set: enc, get: dec },
  size: { type: String, set: enc, get: dec },
  data: { 
    type: Schema.Types.Mixed,
    required: false, 
    set: (val: any) => (val ? encryptDeterm(JSON.stringify(val)) : val),
    get: (val: any) => {
        if (!val || typeof val !== "string") return val;
        try {
            const dec = decryptDeterm(val);
            return dec ? JSON.parse(dec) : val;
        } catch { return val; }
    }
  },
});

export default mongoose.models.Backup ||
  mongoose.model<IBackup>("Backup", BackupSchema);
