// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import app from "./app.js";
import floorRoutes from "./routes/floorRoutes.js";
import customerBuildingRoutes from "./routes/customerBuildingRoutes.js";

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Mount Routes
app.use("/api/floors", floorRoutes);
app.use("/api/customer-building", customerBuildingRoutes);  // ✅ Important

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
