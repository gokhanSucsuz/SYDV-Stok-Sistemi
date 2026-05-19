import CryptoJS from "crypto-js";

const RAW_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || process.env.ENCRYPTION_KEY || "default-key-change-in-production";

// For non-deterministic
export function encryptData(data: string): string {
  return CryptoJS.AES.encrypt(data, RAW_KEY).toString();
}

export function decryptData(ciphertext: string): string {
  if (!ciphertext) return ciphertext;
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, RAW_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch(e) {
    return ciphertext; // Fallback for unencrypted data during migration
  }
}

// Fixed keys for deterministic encryption (32 bytes key, 16 bytes IV for AES)
const DETERMINISTIC_KEY = CryptoJS.enc.Utf8.parse(CryptoJS.SHA256(RAW_KEY).toString(CryptoJS.enc.Hex).substring(0, 32));
const DETERMINISTIC_IV = CryptoJS.enc.Utf8.parse(CryptoJS.MD5(RAW_KEY).toString(CryptoJS.enc.Hex).substring(0, 16));

// For deterministic (searchable)
export function encryptDeterm(data: string | undefined): string | undefined {
  if (data === undefined || data === null) return data;
  return CryptoJS.AES.encrypt(String(data), DETERMINISTIC_KEY, { iv: DETERMINISTIC_IV, mode: CryptoJS.mode.CBC }).toString();
}

export function decryptDeterm(ciphertext: string | undefined): string | undefined {
  if (ciphertext === undefined || ciphertext === null) return ciphertext;
  try {
    const bytes = CryptoJS.AES.decrypt(String(ciphertext), DETERMINISTIC_KEY, { iv: DETERMINISTIC_IV, mode: CryptoJS.mode.CBC });
    const dec = bytes.toString(CryptoJS.enc.Utf8);
    return dec || ciphertext; // Fallback if decryption fails (e.g. legacy cleartext)
  } catch (e) {
    return ciphertext;
  }
}
