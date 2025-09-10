// models/buildingModel.js
import { query } from "../config/db.js";

export class Building {
  // Create a new building
  static async create({ building_name, num_floors, building_address, building_city, building_state, building_country }) {
    // SQL statement to insert a new building and return the inserted row
    const sql = `
      INSERT INTO building 
        (building_name, num_floors, building_address, building_city, building_state, building_country)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING building_id, building_name, num_floors, building_address, building_city, building_state, building_country;
    `;

    // Values array, handling optional fields with null fallback
    const values = [
      building_name,
      num_floors ? Number(num_floors) : null,
      building_address || null,
      building_city || null,
      building_state || null,
      building_country || null,
    ];

    // Execute query and return the first row (inserted building)
    const result = await query(sql, values);
    return result.rows[0];
  }

  // Fetch all buildings
  static async findAll() {
    // Get all buildings ordered by newest first
    const result = await query("SELECT * FROM building ORDER BY building_id DESC");
    return result.rows;
  }

  // Fetch a building by its ID
  static async findById(id) {
    const result = await query("SELECT * FROM building WHERE building_id = $1", [id]);
    return result.rows[0]; // Return single building or undefined if not found
  }

  // Delete a building by ID
  static async delete(id) {
    const result = await query("DELETE FROM building WHERE building_id = $1 RETURNING *", [id]);
    return result.rows[0]; // Return deleted building (or undefined if not found)
  }
}
