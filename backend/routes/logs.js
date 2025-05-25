const express = require("express");
const Log = require("../models/Log");
const auth = require("../middlware.js/auth");
const rbac = require("../middlware.js/rbac");

const router = express.Router();

router.get("/", auth, rbac(["admin"]), async (req, res) => {
  const logs = await Log.find().populate("userId");
  res.json(logs);
});

module.exports = router;
