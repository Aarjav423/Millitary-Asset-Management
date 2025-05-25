const mongoose = require("mongoose");

const AssetSchema = new mongoose.Schema({
  type: String,
  name: String,
  serialNumber: String,
  baseId: { type: mongoose.Schema.Types.ObjectId, ref: "Base" },
  status: {
    type: String,
    enum: ["available", "assigned", "expended"],
    default: "available",
  },
});

module.exports = mongoose.model("Asset", AssetSchema);
