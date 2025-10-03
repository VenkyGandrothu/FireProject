// Import Express framework
import express from "express";

// Import controller functions for virtual sensor operations
import {
  registerVirtualSensor,
  registerVirtualSensorsBulk,
  getAllVirtualSensors,
  getVirtualSensorById,
  deleteVirtualSensor,
  getVirtualSensorsByFloor,
} from "../controllers/virtualSensorController.js";

// Create a new Express Router instance
const router = express.Router();

// ----------------------
// Routes for Virtual Sensor
// ----------------------

// POST /register
// Register a single virtual sensor
// Expects a virtual sensor object in the request body
router.post("/register", registerVirtualSensor);

// POST /bulk
// Bulk register virtual sensors
// Expects an array of virtual sensor objects in the request body
router.post("/bulk", registerVirtualSensorsBulk);

// GET /
// Get all virtual sensors
// Returns an array of all registered virtual sensors
router.get("/", getAllVirtualSensors);

// GET /floor/:floorId
// Get all virtual sensors for a specific floor
// Place before /:id because route order matters
router.get("/floor/:floorId", getVirtualSensorsByFloor);

// GET /:id
// Get a virtual sensor by its ID
router.get("/:id", getVirtualSensorById);

// DELETE /:id
// Delete a virtual sensor by its ID
router.delete("/:id", deleteVirtualSensor);

// Export the router to be used in the main server file
export default router;
