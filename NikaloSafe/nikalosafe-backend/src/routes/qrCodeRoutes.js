// Import Express framework
import express from "express";

// Import controller functions for QR code operations
import { registerQRCodes, getQRCodes, getQRCodesByFloor } from "../controllers/qrCodeController.js";

// Create a new Express Router instance
const router = express.Router();

// ----------------------
// Routes for QR Code
// ----------------------

// POST /register
// Register one or multiple QR codes
// Expects an array of QR code objects or a single QR code object in the request body
router.post("/register", registerQRCodes);

// GET /
// Fetch all QR codes
// Returns an array of all registered QR codes
router.get("/", getQRCodes);

// GET QR codes by floor
router.get("/floor/:floor_id", getQRCodesByFloor);

// Export the router to be used in the main server file
export default router;
