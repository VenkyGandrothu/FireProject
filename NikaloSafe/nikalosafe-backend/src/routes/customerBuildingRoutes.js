// Import Express framework
import express from "express";

// Import controller functions for customer-building operations
import {
  registerCustomerBuilding, // Handles registering a new customer-building relation
  getAllCustomerBuildings,  // Retrieves all customer-building relations
  getCustomerBuildingById,  // Retrieves a single customer-building relation by ID
  deleteCustomerBuilding,   // Deletes a customer-building relation by ID
} from "../controllers/customerBuildingController.js";

// Create a new Express Router instance
const router = express.Router();

// ----------------------
// Routes for Customer-Building Relation
// ----------------------

// POST /register
// Registers a new relation between a customer and a building
// Expects customerId and buildingId in the request body
router.post("/register", registerCustomerBuilding);

// GET /
// Fetch all customer-building relations
// Returns an array of all relations
router.get("/", getAllCustomerBuildings);

// GET /:id
// Fetch a single customer-building relation by its ID
// Returns a relation object if found
router.get("/:id", getCustomerBuildingById);

// DELETE /:id
// Delete a customer-building relation by its ID
// Returns success/failure message
router.delete("/:id", deleteCustomerBuilding);

// Export the router to be used in the main server file
export default router;
