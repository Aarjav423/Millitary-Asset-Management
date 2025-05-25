const express = require("express");
const Base = require("../models/Base");
const auth = require("../middlware.js/auth");
const rbac = require("../middlware.js/rbac");
const logger = require("../middlware.js/logger");

const router = express.Router();

// Get all bases (admin/logistics)
router.get(
  "/",
  auth,
  rbac(["admin", "logistics_officer", "base_commander"]), // Add base_commander here if needed
  async (req, res) => {
    const bases = await Base.find();
    res.json(bases);
  }
);

// Create base (admin only)
router.post(
  "/",
  auth,
  rbac(["admin"]),
  logger("create_base"),
  async (req, res) => {
    const base = new Base(req.body);
    await base.save();
    res.json(base);
  }
);

module.exports = router;
