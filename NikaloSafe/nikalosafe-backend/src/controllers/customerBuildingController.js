import { CustomerBuilding } from "../models/customerBuildingModel.js";

// Controller → Register a new customer-building relation
export const registerCustomerBuilding = async (req, res) => {
  try {
    const data = req.body;

    const { customer_id, building_id, start_date, end_date, days_of_subscription } = data;

    // Validate required fields
    if (!customer_id || !building_id) {
      return res.status(400).json({ success: false, message: "Customer and Building are required" });
    }

    // Validate date fields
    const start = new Date(start_date);
    const end = new Date(end_date);
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ success: false, message: "Invalid dates" });
    }
    if (end < start) {
      return res.status(400).json({ success: false, message: "End date cannot be before start date" });
    }

    // Validate days of subscription against the date range
    const expectedDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    if (Number(days_of_subscription) !== expectedDays) {
      return res.status(400).json({ success: false, message: "Days of subscription mismatch with dates" });
    }

    // Call model to create the relation
    const newRelation = await CustomerBuilding.create(data);

    // Return success response with the newly created relation
    res.status(201).json({ success: true, relation: newRelation });
  } catch (err) {
    console.error("registerCustomerBuilding:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Controller → Get all customer-building relations
export const getAllCustomerBuildings = async (req, res) => {
  try {
    // Call model to fetch all relations
    const relations = await CustomerBuilding.findAll();
    
    // Send response with the list of relations
    res.json({ success: true, relations });
  } catch (err) {
    console.error("getAllCustomerBuildings:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Controller → Get a single relation by ID
export const getCustomerBuildingById = async (req, res) => {
  try {
    const { id } = req.params;

    // Call model to fetch the relation
    const relation = await CustomerBuilding.findById(id);

    // Handle not found
    if (!relation) return res.status(404).json({ success: false, message: "Relation not found" });

    // Return the relation
    res.json({ success: true, relation });
  } catch (err) {
    console.error("getCustomerBuildingById:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Controller → Delete a relation by ID
export const deleteCustomerBuilding = async (req, res) => {
  try {
    const { id } = req.params;

    // Call model to delete the relation
    const deleted = await CustomerBuilding.delete(id);

    // Handle not found
    if (!deleted) return res.status(404).json({ success: false, message: "Relation not found" });

    // Return success response
    res.json({ success: true, message: "Relation deleted", relation: deleted });
  } catch (err) {
    console.error("deleteCustomerBuilding:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
