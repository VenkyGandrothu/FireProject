// controllers/customerBuildingController.js
import { CustomerBuilding } from "../models/customerBuildingModel.js";

// Register relation
export const registerCustomerBuilding = async (req, res) => {
  try {
    const data = req.body;

    const { customer_id, building_id, start_date, end_date, days_of_subscription } = data;

    if (!customer_id || !building_id) {
      return res.status(400).json({ success: false, message: "Customer and Building are required" });
    }

    // Validate dates
    const start = new Date(start_date);
    const end = new Date(end_date);
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ success: false, message: "Invalid dates" });
    }
    if (end < start) {
      return res.status(400).json({ success: false, message: "End date cannot be before start date" });
    }

    // Validate days
    const expectedDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    if (Number(days_of_subscription) !== expectedDays) {
      return res.status(400).json({ success: false, message: "Days of subscription mismatch with dates" });
    }

    const newRelation = await CustomerBuilding.create(data);
    res.status(201).json({ success: true, relation: newRelation });
  } catch (err) {
    console.error("registerCustomerBuilding:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all relations
export const getAllCustomerBuildings = async (req, res) => {
  try {
    const relations = await CustomerBuilding.findAll();
    res.json({ success: true, relations });
  } catch (err) {
    console.error("getAllCustomerBuildings:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get by ID
export const getCustomerBuildingById = async (req, res) => {
  try {
    const { id } = req.params;
    const relation = await CustomerBuilding.findById(id);
    if (!relation) return res.status(404).json({ success: false, message: "Relation not found" });
    res.json({ success: true, relation });
  } catch (err) {
    console.error("getCustomerBuildingById:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete relation
export const deleteCustomerBuilding = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CustomerBuilding.delete(id);
    if (!deleted) return res.status(404).json({ success: false, message: "Relation not found" });
    res.json({ success: true, message: "Relation deleted", relation: deleted });
  } catch (err) {
    console.error("deleteCustomerBuilding:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
