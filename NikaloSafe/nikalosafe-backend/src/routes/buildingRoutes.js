// Import Express framework
import express from "express";

// Import controller functions for building operations
import { 
  registerBuilding, // Handles registering a new building
  getAllBuildings   // Retrieves all buildings from the database
} from "../controllers/buildingController.js";

// Create a new Express Router instance
const router = express.Router();

// ----------------------
// Routes for Building
// ----------------------

// POST /register
// Registers a new building
// Expects building data in the request body
router.post("/register", registerBuilding);

// GET /
// Fetch all buildings
// Returns an array of all building objects
router.get("/", getAllBuildings);

// Export the router to be used in the main server file
export default router;
