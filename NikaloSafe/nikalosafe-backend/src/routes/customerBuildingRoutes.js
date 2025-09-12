// routes/customerBuildingRoutes.js
import express from "express";
import {
  registerCustomerBuilding,
  getAllCustomerBuildings,
  getCustomerBuildingById,
  deleteCustomerBuilding,
} from "../controllers/customerBuildingController.js";

const router = express.Router();

// Register a new relation
router.post("/register", registerCustomerBuilding);

// Get all relations
router.get("/", getAllCustomerBuildings);

// Get relation by ID
router.get("/:id", getCustomerBuildingById);

// Delete relation
router.delete("/:id", deleteCustomerBuilding);

export default router;
