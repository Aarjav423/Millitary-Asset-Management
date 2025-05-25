const mongoose = require("mongoose");

const MovementSchema = new mongoose.Schema({
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: "Asset" },
  type: {
    type: String,
    enum: [
      "purchase",
      "transfer_in",
      "transfer_out",
      "assignment",
      "expenditure",
    ],
    required: true,
  },
  fromBaseId: { type: mongoose.Schema.Types.ObjectId, ref: "Base" },
  toBaseId: { type: mongoose.Schema.Types.ObjectId, ref: "Base" },
  personnel: String,
  quantity: { type: Number, default: 1 },
  timestamp: { type: Date, default: Date.now },
  details: Object,
});

module.exports = mongoose.model("Movement", MovementSchema);
