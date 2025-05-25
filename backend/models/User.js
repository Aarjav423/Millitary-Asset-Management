const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  passwordHash: String,
  role: {
    type: String,
    enum: ["admin", "base_commander", "logistics_officer"],
    required: true,
  },
  baseId: { type: mongoose.Schema.Types.ObjectId, ref: "Base" },
});

module.exports = mongoose.model("User", UserSchema);
