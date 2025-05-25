const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./db");
require("dotenv").config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const authRoutes = require("./routes/auth");
const assetRoutes = require("./routes/assets");
const baseRoutes = require("./routes/bases");
const movementRoutes = require("./routes/movements");
const logRoutes = require("./routes/logs");

app.use("/api/auth", authRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/bases", baseRoutes);
app.use("/api/movements", movementRoutes);
app.use("/api/logs", logRoutes);
// TODO: Add routes here

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
