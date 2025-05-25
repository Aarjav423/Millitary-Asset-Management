const express = require("express");
const Movement = require("../models/Movement");
const Asset = require("../models/Asset");
const auth = require("../middlware.js/auth");
const rbac = require("../middlware.js/rbac");
const logger = require("../middlware.js/logger");

const router = express.Router();

// Record a purchase
router.post(
  "/purchase",
  auth,
  rbac(["admin", "logistics_officer"]),
  logger("purchase"),
  async (req, res) => {
    const { assetId, quantity, toBaseId } = req.body;
    const movement = await Movement.create({
      assetId,
      type: "purchase",
      toBaseId,
      quantity,
    });
    res.json(movement);
  }
);

// Record a transfer
router.post(
  "/transfer",
  auth,
  rbac(["admin", "logistics_officer"]),
  logger("transfer"),
  async (req, res) => {
    const { assetId, fromBaseId, toBaseId, quantity } = req.body;
    const movementOut = await Movement.create({
      assetId,
      type: "transfer_out",
      fromBaseId,
      toBaseId,
      quantity,
    });
    const movementIn = await Movement.create({
      assetId,
      type: "transfer_in",
      fromBaseId,
      toBaseId,
      quantity,
    });
    res.json({ movementOut, movementIn });
  }
);

// Record assignment
router.post(
  "/assign",
  auth,
  rbac(["admin", "base_commander"]),
  logger("assignment"),
  async (req, res) => {
    const { assetId, personnel, quantity } = req.body;
    const movement = await Movement.create({
      assetId,
      type: "assignment",
      personnel,
      quantity,
    });
    await Asset.findByIdAndUpdate(assetId, { status: "assigned" });
    res.json(movement);
  }
);

// Record expenditure
router.post(
  "/expend",
  auth,
  rbac(["admin", "base_commander"]),
  logger("expenditure"),
  async (req, res) => {
    const { assetId, quantity } = req.body;
    const movement = await Movement.create({
      assetId,
      type: "expenditure",
      quantity,
    });
    await Asset.findByIdAndUpdate(assetId, { status: "expended" });
    res.json(movement);
  }
);

// Get movement history (filtered)
// router.get(
//   "/",
//   auth,
//   rbac(["admin", "base_commander", "logistics_officer"]),
//   async (req, res) => {
//     const { baseId, assetId, type } = req.query;
//     let query = {};
//     if (baseId) query.$or = [{ fromBaseId: baseId }, { toBaseId: baseId }];
//     if (assetId) query.assetId = assetId;
//     if (type) query.type = type;
//     const movements = await Movement.find(query).populate(
//       "assetId fromBaseId toBaseId"
//     );
//     res.json(movements);
//   }
// );

router.get(
  "/",
  auth,
  rbac(["admin", "base_commander", "logistics_officer"]),
  async (req, res) => {
    const { baseId, assetId, type, startDate, endDate, equipmentType } =
      req.query;
    let query = {};
    if (baseId) query.$or = [{ fromBaseId: baseId }, { toBaseId: baseId }];
    if (assetId) query.assetId = assetId;
    if (type) query.type = type;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }
    if (equipmentType) {
      const assets = await require("../models/Asset").find({
        type: equipmentType,
      });
      query.assetId = { $in: assets.map((a) => a._id) };
    }
    const movements = await Movement.find(query).populate(
      "assetId fromBaseId toBaseId"
    );
    res.json(movements);
  }
);

// Get assignment history
router.get(
  "/assignments",
  auth,
  rbac(["admin", "base_commander"]),
  async (req, res) => {
    const assignments = await Movement.find({ type: "assignment" }).populate(
      "assetId personnel"
    );
    res.json(assignments);
  }
);

// Get expenditure history
router.get(
  "/expenditures",
  auth,
  rbac(["admin", "base_commander"]),
  async (req, res) => {
    const expenditures = await Movement.find({ type: "expenditure" }).populate(
      "assetId"
    );
    res.json(expenditures);
  }
);

module.exports = router;
