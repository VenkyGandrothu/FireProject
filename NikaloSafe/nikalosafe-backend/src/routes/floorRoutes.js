// Import Express framework
import express from "express";

// Import controller functions for handling floor-related operations
import {
  registerFloor,       // Handles registering a new floor
  getAllFloors,        // Retrieves all floors
  getFloorsByBuilding, // Retrieves floors for a specific building
  getFloorById,        // Retrieves a single floor by its ID
  deleteFloor,         // Deletes a floor by its ID
} from "../controllers/floorController.js";

// Create a new Express Router instance
const router = express.Router();

// ----------------------
// Routes for Floor
// ----------------------

// POST /register
// Register a new floor in the system
router.post("/register", registerFloor);

// GET /
// Fetch all floors in the system
router.get("/", getAllFloors);

// GET /building/:building_id
// Fetch all floors belonging to a specific building by building ID
router.get("/building/:building_id", getFloorsByBuilding);

// GET /:id
// Fetch a specific floor by its unique ID
router.get("/:id", getFloorById);

// DELETE /:id
// Delete a specific floor by its unique ID
router.delete("/:id", deleteFloor);

// Export the router to be used in the main app
export default router;
