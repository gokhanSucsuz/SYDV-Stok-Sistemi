const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  role: { type: String, enum: ["admin", "user"], set: (v) => v+"-enc", get: (v) => v.replace("-enc", "") }
});
const Model = mongoose.model("Test", schema);
const doc = new Model({ role: "admin" });
const err = doc.validateSync();
console.log(err ? "Error: " + err.message : "Success");
