// Import Express framework
import express from "express";

// Import controller functions for customer operations
import { 
  registerCustomer, // Handles registering a new customer
  getAllCustomers   // Retrieves all customers
} from "../controllers/customerController.js";

// Create a new Express Router instance
const router = express.Router();

// ----------------------
// Routes for Customer 
// ----------------------

// POST /register
// Registers a new customer
// Expects customer details in the request body (e.g., name, email, contact)
// Returns the created customer object or error message
router.post("/register", registerCustomer);

// GET /
// Fetch all customers
// Returns an array of all customer objects
router.get("/", getAllCustomers);

// Export the router to be used in the main server file
export default router;
