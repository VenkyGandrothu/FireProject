import { Floor } from "../models/floorModel.js";

// Register a new floor or multiple floors
export const registerFloor = async (req, res) => {
  try {
    // Support both single object and array of floors
    const floorsData = Array.isArray(req.body) ? req.body : [req.body];

    const insertedFloors = [];
    // Loop through each floor data and create in DB
    for (const floorData of floorsData) {
      const floor = await Floor.create(floorData);
      insertedFloors.push(floor);
    }

    // Respond with inserted floor(s)
    res.status(201).json({ success: true, floors: insertedFloors });
  } catch (err) {
    console.error("registerFloor:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all floors
export const getAllFloors = async (req, res) => {
  try {
    const floors = await Floor.findAll(); // Fetch all floors from DB
    res.json({ success: true, floors });
  } catch (err) {
    console.error("getAllFloors:", err);
    res.status(500).json({ success: false });
  }
};

// Get floors by building_id
export const getFloorsByBuilding = async (req, res) => {
  try {
    const { building_id } = req.params; // Extract building_id from request params
    const floors = await Floor.findByBuilding(building_id); // Fetch floors for given building
    res.json({ success: true, floors });
  } catch (err) {
    console.error("getFloorsByBuilding:", err);
    res.status(500).json({ success: false });
  }
};

// Get a single floor by ID
export const getFloorById = async (req, res) => {
  try {
    const { id } = req.params; // Extract floor ID from request params
    const floor = await Floor.findById(id); // Fetch floor by ID
    if (!floor) return res.status(404).json({ success: false, message: "Floor not found" });

    res.json({ success: true, floor });
  } catch (err) {
    console.error("getFloorById:", err);
    res.status(500).json({ success: false });
  }
};

// Delete a floor by ID
export const deleteFloor = async (req, res) => {
  try {
    const { id } = req.params; // Extract floor ID from request params
    const floor = await Floor.delete(id); // Delete floor from DB
    if (!floor) return res.status(404).json({ success: false, message: "Floor not found" });

    res.json({ success: true, message: "Floor deleted", floor });
  } catch (err) {
    console.error("deleteFloor:", err);
    res.status(500).json({ success: false });
  }
};
