import express from "express";
import {
  registerSensor,
  registerSensorsBulk,
  getAllSensors,
  getSensorById,
  getSensorsByFloor,
  deleteSensor,
} from "../controllers/physicalSensorController.js";

const router = express.Router();

// Register a single sensor
router.post("/register", registerSensor);

// Bulk register sensors
router.post("/bulk", registerSensorsBulk);

// Get all sensors
router.get("/", getAllSensors);

// Get sensor by ID
router.get("/:id", getSensorById);

// Delete sensor
router.delete("/:id", deleteSensor);

// Get sensors by floor
router.get("/floor/:floorId", getSensorsByFloor);

export default router;
