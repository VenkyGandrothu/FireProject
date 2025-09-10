import { query } from "../config/db.js";

// Insert a new customer into the database
export async function createCustomer({ name, email, phonenumber, address, city, state, country }) {
  // SQL query → insert customer and return the newly created row
  const sql = `
    INSERT INTO customer 
      (customer_name, customer_email, customer_phone, customer_address, customer_city, customer_state, customer_country)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING customer_id, customer_name, customer_email, customer_phone, customer_address, customer_city, customer_state, customer_country;
  `;

  // Values array → match placeholders $1…$7
  const values = [
    name,
    email,
    phonenumber || null, // default to null if not provided
    address || null,
    city || null,
    state || null,
    country || null,
  ];

  // Execute query and return result (controller will handle result.rows)
  return query(sql, values);
}

// Fetch all customers from the database
export async function getCustomers() {
  // Order by newest first
  return query("SELECT * FROM customer ORDER BY customer_id DESC");
}
