import { Building } from "../models/buildingModel.js"; // Import the Building model

// Controller → Register a new building
export const registerBuilding = async (req, res) => {
  try {
    // Call the model's create method with request body data
    const building = await Building.create(req.body);

    // Send a success response with the newly created building
    res.status(201).json({ success: true, building });
  } catch (err) {
    // Log the error to console for debugging
    console.error("registerBuilding:", err);

    // Send a generic server error response to the client
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Controller → Fetch all buildings
export const getAllBuildings = async (req, res) => {
  try {
    // Call the model's findAll method to fetch all building records
    const buildings = await Building.findAll();

    // Send success response with the list of buildings
    res.json({ success: true, buildings });
  } catch (err) {
    // Log the error to console
    console.error("getAllBuildings:", err);

    // Send a generic server error response
    res.status(500).json({ success: false });
  }
};
