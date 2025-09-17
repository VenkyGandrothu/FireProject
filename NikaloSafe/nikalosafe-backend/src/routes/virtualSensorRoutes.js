import express from "express";
import {
  registerVirtualSensor,
  registerVirtualSensorsBulk,
  getAllVirtualSensors,
  getVirtualSensorById,
  deleteVirtualSensor,
  getVirtualSensorsByFloor,
} from "../controllers/virtualSensorController.js";

const router = express.Router();

// Register a single virtual sensor
router.post("/register", registerVirtualSensor);

// Bulk register virtual sensors
router.post("/bulk", registerVirtualSensorsBulk);

// Get all virtual sensors
router.get("/", getAllVirtualSensors);

// Order matters → put /floor before /:id
router.get("/floor/:floorId", getVirtualSensorsByFloor);

// Get virtual sensor by ID
router.get("/:id", getVirtualSensorById);

// Delete virtual sensor
router.delete("/:id", deleteVirtualSensor);

export default router;
