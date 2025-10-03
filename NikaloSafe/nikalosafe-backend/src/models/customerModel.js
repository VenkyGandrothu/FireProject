import { query } from "../config/db.js";

/**
 * Insert a new customer into the database
 * @param {Object} params - Customer details
 * @param {string} params.name - Customer's name
 * @param {string} params.email - Customer's email
 * @param {string} [params.phonenumber] - Customer's phone number (optional)
 * @param {string} [params.address] - Customer's address (optional)
 * @param {string} [params.city] - Customer's city (optional)
 * @param {string} [params.state] - Customer's state (optional)
 * @param {string} [params.country] - Customer's country (optional)
 * @returns {Promise<Object>} Newly created customer object
 */
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

/**
 * Fetch all customers from the database
 * @returns {Promise<Array<Object>>} List of all customers ordered by newest first
 */
export async function getCustomers() {
  // Order by newest first
  return query("SELECT * FROM customer ORDER BY customer_id DESC");
}
