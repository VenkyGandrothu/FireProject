import express from "express";
import { registerBuilding, getAllBuildings } from "../controllers/buildingController.js";

const router = express.Router(); // Create a new Express router instance

// Route → Register a new building
// POST /api/buildings/register
router.post("/register", registerBuilding);

// Route → Get all buildings
// GET /api/buildings
router.get("/", getAllBuildings);

export default router; // Export router to be used in server.js
