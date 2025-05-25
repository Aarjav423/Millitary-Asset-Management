const express = require("express");
const Asset = require("../models/Asset");
const auth = require("../middlware.js/auth");
const rbac = require("../middlware.js/rbac");
const logger = require("../middlware.js/logger");

const router = express.Router();

// Get all assets (admin) or by base (commander/logistics)
router.get(
  "/",
  auth,
  rbac(["admin", "base_commander", "logistics_officer"]),
  async (req, res) => {
    let query = {};
    if (req.user.role !== "admin") {
      query.baseId = req.user.baseId;
    }
    const assets = await Asset.find(query).populate("baseId");
    res.json(assets);
  }
);

// Get all unique asset types and names (for purchases)
router.get(
  "/types",
  auth,
  rbac(["admin", "logistics_officer", "base_commander"]),
  async (req, res) => {
    const assets = await Asset.find({});
    // Return unique {type, name} pairs
    const unique = [];
    const seen = new Set();
    for (const a of assets) {
      const key = `${a.type}|${a.name}`;
      if (!seen.has(key)) {
        unique.push({ type: a.type, name: a.name });
        seen.add(key);
      }
    }
    res.json(unique);
  }
);

module.exports = router;

// Create asset (admin only)
router.post(
  "/",
  auth,
  rbac(["admin"]),
  logger("create_asset"),
  async (req, res) => {
    const asset = new Asset(req.body);
    await asset.save();
    res.json(asset);
  }
);

// Update asset (admin only)
router.put(
  "/:id",
  auth,
  rbac(["admin"]),
  logger("update_asset"),
  async (req, res) => {
    const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(asset);
  }
);

// Delete asset (admin only)
router.delete(
  "/:id",
  auth,
  rbac(["admin"]),
  logger("delete_asset"),
  async (req, res) => {
    await Asset.findByIdAndDelete(req.params.id);
    res.json({ msg: "Asset deleted" });
  }
);

module.exports = router;
