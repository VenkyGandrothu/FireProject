import express from "express";
import { registerCustomer, getAllCustomers } from "../controllers/customerController.js";

const router = express.Router(); // Initialize Express router

// Route → Register a new customer
// POST /api/customers/register
router.post("/register", registerCustomer);

// Route → Get all customers
// GET /api/customers
router.get("/", getAllCustomers);

export default router; // Export router so it can be mounted in server.js
