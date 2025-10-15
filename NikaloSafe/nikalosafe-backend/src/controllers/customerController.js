import prisma from '../config/prisma.js';

// Controller → Register a new customer
export async function registerCustomer(req, res) {
  try {
    // Extract customer data from request body
    const { name, email, phonenumber, address, city, state, country } = req.body;

    // Validate required fields: name and email are mandatory
    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and email required" });
    }

    // Create customer using Prisma
    const customer = await prisma.customer.create({
      data: {
        customer_name: name,
        customer_email: email,
        customer_phone: phonenumber || null,
        customer_address: address || null,
        customer_city: city || null,
        customer_state: state || null,
        customer_country: country || null,
      },
    });

    // Return success response with the newly created customer
    return res.status(201).json({ success: true, customer });

  } catch (err) {
    console.error("registerCustomer:", err);

    // Handle unique constraint violations (Prisma error code P2002)
    if (err.code === "P2002") {
      if (err.meta?.target?.includes("customer_email")) {
        return res.status(409).json({ success: false, message: "Email already exists" });
      }
      if (err.meta?.target?.includes("customer_phone")) {
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
    // Fetch all customers using Prisma
    const customers = await prisma.customer.findMany({
      orderBy: {
        customer_id: 'desc',
      },
    });

    // Send success response with the list of customers
    res.status(200).json({ success: true, customers });
  } catch (err) {
    console.error("getAllCustomers:", err);

    // Send error response if the query fails
    res.status(500).json({ success: false, message: "Server error" });
  }
}