import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg; // Extract Pool class from pg package

dotenv.config(); // Load environment variables from .env file

// Create a new PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER,       // Database username
  host: process.env.DB_HOST,       // Database host (e.g., localhost)
  database: process.env.DB_NAME,   // Database name
  password: process.env.DB_PASSWORD, // Database password
  port: Number(process.env.DB_PORT || 5432), // Default port 5432 if not provided
  // application_name: 'nikalosafe-backend' // optional identifier for logs
});

// Helper function to run queries with schema set to 'core'
export async function query(text, params) {
  const client = await pool.connect(); // Get a client connection from the pool
  try {
    await client.query("SET search_path TO core"); // Ensure schema is set to 'core'
    return await client.query(text, params); // Run the actual query with parameters
  } finally {
    client.release(); // Release client back to pool (important to avoid leaks)
  }
}

// Export the pool instance (optional if you need direct access elsewhere)
export default pool;
