const CryptoJS = require("crypto-js");
const key = CryptoJS.enc.Utf8.parse("12345678901234567890123456789012");
const iv  = CryptoJS.enc.Utf8.parse("1234567890123456");
const enc = CryptoJS.AES.encrypt("Ekmek", key, { iv: iv, mode: CryptoJS.mode.CBC }).toString();
const enc2 = CryptoJS.AES.encrypt("Ekmek", key, { iv: iv, mode: CryptoJS.mode.CBC }).toString();
console.log(enc === enc2, enc);
