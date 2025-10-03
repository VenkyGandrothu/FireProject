// Import Express framework
import express from "express";

// Import controller functions for physical sensor operations
import {
  registerSensor,       // Handles registering a single sensor
  registerSensorsBulk,  // Handles bulk registration of multiple sensors
  getAllSensors,        // Retrieves all sensors
  getSensorById,        // Retrieves a sensor by its ID
  getSensorsByFloor,    // Retrieves all sensors for a specific floor
  deleteSensor,         // Deletes a sensor by ID
} from "../controllers/physicalSensorController.js";

// Create a new Express Router instance
const router = express.Router();

// ----------------------
// Routes for Physical Sensor
// ----------------------

// POST /register
// Register a single physical sensor
// Expects sensor details in the request body (e.g., sensor_number, type, floorId)
router.post("/register", registerSensor);

// POST /bulk
// Register multiple sensors at once (bulk)
// Expects an array of sensor objects in the request body
router.post("/bulk", registerSensorsBulk);

// GET /
// Fetch all sensors
// Returns an array of all physical sensor objects
router.get("/", getAllSensors);

// GET /:id
// Fetch a single sensor by ID
// Returns the sensor object or an error if not found
router.get("/:id", getSensorById);

// DELETE /:id
// Delete a sensor by ID
// Returns success message or error if the sensor does not exist
router.delete("/:id", deleteSensor);

// GET /floor/:floorId
// Fetch all sensors associated with a specific floor
// Returns an array of sensors for the given floor ID
router.get("/floor/:floorId", getSensorsByFloor);

// Export the router to be used in the main server file
export default router;
