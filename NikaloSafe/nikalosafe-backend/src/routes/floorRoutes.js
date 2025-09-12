import express from "express";
import {
  registerFloor,
  getAllFloors,
  getFloorsByBuilding,
  getFloorById,
  deleteFloor,
} from "../controllers/floorController.js";

const router = express.Router();

// Register a new floor
router.post("/register", registerFloor);

// Get all floors
router.get("/", getAllFloors);

// Get floors by building ID
router.get("/building/:building_id", getFloorsByBuilding);

// Get a floor by ID
router.get("/:id", getFloorById);

// Delete a floor
router.delete("/:id", deleteFloor);

export default router;
