// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// require("dotenv").config();

// const Base = require("./models/Base");
// const Asset = require("./models/Asset");
// const User = require("./models/User");

// const MONGO_URI = process.env.MONGO_URI;

// async function seed() {
//   await mongoose.connect(MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });

//   // Clear existing data
//   await Base.deleteMany({});
//   await Asset.deleteMany({});
//   await User.deleteMany({});

//   // Create Bases
//   const bases = await Base.insertMany([
//     { name: "Alpha Base", location: "North" },
//     { name: "Bravo Base", location: "South" },
//   ]);

//   // Create Assets
//   await Asset.insertMany([
//     {
//       type: "vehicle",
//       name: "Humvee",
//       serialNumber: "V001",
//       baseId: bases[0]._id,
//       status: "available",
//     },
//     {
//       type: "weapon",
//       name: "Rifle",
//       serialNumber: "W001",
//       baseId: bases[1]._id,
//       status: "available",
//     },
//     {
//       type: "ammunition",
//       name: "5.56mm Rounds",
//       serialNumber: "A001",
//       baseId: bases[0]._id,
//       status: "available",
//     },
//   ]);

//   // Create Users
//   const adminPassword = await bcrypt.hash("admin123", 10);
//   const commanderPassword = await bcrypt.hash("commander123", 10);
//   const logisticsPassword = await bcrypt.hash("logistics123", 10);

//   await User.insertMany([
//     {
//       username: "admin",
//       passwordHash: adminPassword,
//       role: "admin",
//     },
//     {
//       username: "commander",
//       passwordHash: commanderPassword,
//       role: "base_commander",
//       baseId: bases[0]._id,
//     },
//     {
//       username: "logistics",
//       passwordHash: logisticsPassword,
//       role: "logistics_officer",
//       baseId: bases[1]._id,
//     },
//   ]);

//   console.log("Dummy data seeded!");
//   process.exit();
// }

// seed();

const mongoose = require("mongoose");
require("dotenv").config();
const Asset = require("./models/Asset");
const Base = require("./models/Base");
const Movement = require("./models/Movement");
const User = require("./models/User");

// Helper to get asset/base/user by name
async function getByName(model, name) {
  return model.findOne({ name });
}

async function seedMovements() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Get assets and bases
  const humvee = await getByName(Asset, "Humvee");
  const rifle = await getByName(Asset, "Rifle");
  const ammo = await getByName(Asset, "5.56mm Rounds");
  const alpha = await getByName(Base, "Alpha Base");
  const bravo = await getByName(Base, "Bravo Base");

  // Purchases
  await Movement.create([
    {
      assetId: humvee._id,
      type: "purchase",
      toBaseId: alpha._id,
      quantity: 2,
      timestamp: new Date(),
    },
    {
      assetId: rifle._id,
      type: "purchase",
      toBaseId: bravo._id,
      quantity: 10,
      timestamp: new Date(),
    },
  ]);

  // Transfers
  await Movement.create([
    {
      assetId: rifle._id,
      type: "transfer_out",
      fromBaseId: bravo._id,
      toBaseId: alpha._id,
      quantity: 3,
      timestamp: new Date(),
    },
    {
      assetId: rifle._id,
      type: "transfer_in",
      fromBaseId: bravo._id,
      toBaseId: alpha._id,
      quantity: 3,
      timestamp: new Date(),
    },
  ]);

  // Assignments
  await Movement.create([
    {
      assetId: humvee._id,
      type: "assignment",
      personnel: "John Doe",
      quantity: 1,
      timestamp: new Date(),
    },
    {
      assetId: rifle._id,
      type: "assignment",
      personnel: "Jane Smith",
      quantity: 2,
      timestamp: new Date(),
    },
  ]);

  // Expenditures
  await Movement.create([
    {
      assetId: ammo._id,
      type: "expenditure",
      quantity: 100,
      timestamp: new Date(),
    },
    {
      assetId: rifle._id,
      type: "expenditure",
      quantity: 1,
      timestamp: new Date(),
    },
  ]);

  console.log(
    "Dummy movements (purchases, transfers, assignments, expenditures) inserted!"
  );
  process.exit();
}
