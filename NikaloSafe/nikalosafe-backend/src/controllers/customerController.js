import { createCustomer, getCustomers } from "../models/customerModel.js";

// Controller → Register a new customer
export async function registerCustomer(req, res) {
  try {
    // Extract customer data from request body
    const { name, email, phonenumber, address, city, state, country } = req.body;

    // Validate required fields: name and email are mandatory
    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and email required" });
    }

    // Call model function to insert the customer into the database
    const result = await createCustomer({ name, email, phonenumber, address, city, state, country });

    // Return success response with the newly created customer
    return res.status(201).json({ success: true, customer: result.rows[0] });

  } catch (err) {
    console.error("registerCustomer:", err);

    // Handle unique constraint violations (PostgreSQL error code 23505)
    if (err.code === "23505") {
      if (err.detail.includes("customer_email")) {
        return res.status(409).json({ success: false, message: "Email already exists" });
      }
      if (err.detail.includes("customer_phone")) {
        return res.status(409).json({ success: false, message: "Phone number already exists" });
      }
      return res.status(409).json({ success: false, message: "Duplicate entry" });
    }

    // Fallback for unexpected server errors
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// Controller → Get all customers
export async function getAllCustomers(req, res) {
  try {
    // Call model function to fetch all customers from the database
    const result = await getCustomers();

    // Send success response with the list of customers
    res.status(200).json({ success: true, customers: result.rows });
  } catch (err) {
    console.error("getAllCustomers:", err);

    // Send error response if the query fails
    res.status(500).json({ success: false, message: "Server error" });
  }
}
