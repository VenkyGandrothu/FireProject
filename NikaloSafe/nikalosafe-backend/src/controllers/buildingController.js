// controllers/buildingController.js
import { Building } from "../models/buildingModel.js"; // Import the Building model

// Controller → Register a new building
export const registerBuilding = async (req, res) => {
  try {
    // Create a new building record using request body data
    const building = await Building.create(req.body);

    // Send success response with the created building
    res.status(201).json({ success: true, building });
  } catch (err) {
    // Log error for debugging
    console.error("registerBuilding:", err);

    // Send error response to client
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Controller → Fetch all buildings
export const getAllBuildings = async (req, res) => {
  try {
    // Fetch all buildings from DB
    const buildings = await Building.findAll();

    // Send success response with list of buildings
    res.json({ success: true, buildings });
  } catch (err) {
    // Log error if query fails
    console.error(err);

    // Send generic error response
    res.status(500).json({ success: false });
  }
};
