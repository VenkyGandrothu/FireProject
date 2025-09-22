// models/buildingModel.js
import { query } from "../config/db.js";

export class Building {
  // Create a new building record
  // @param {Object} params - Building details
  // @param {string} params.building_name - Name of the building
  // @param {number} params.num_floors - Number of floors
  // @param {string} params.building_address - Address of the building
  // @param {string} params.building_city - City of the building
  // @param {string} params.building_state - State of the building
  // @param {string} params.building_country - Country of the building
  // @returns {Object} Newly created building object
  static async create({ building_name, num_floors, building_address, building_city, building_state, building_country }) {
    const sql = `
      INSERT INTO building 
        (building_name, num_floors, building_address, building_city, building_state, building_country)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING building_id, building_name, num_floors, building_address, building_city, building_state, building_country;
    `;

    const values = [
      building_name,
      num_floors ? Number(num_floors) : null,
      building_address || null,
      building_city || null,
      building_state || null,
      building_country || null,
    ];

    const result = await query(sql, values);
    return result.rows[0];
  }

  // Fetch all buildings from the database
  // @returns {Array} List of building objects ordered by newest first
  static async findAll() {
    const result = await query("SELECT * FROM building ORDER BY building_id DESC");
    return result.rows;
  }

  // Fetch a building by its ID
  // @param {number} id - Building ID
  // @returns {Object|undefined} Building object if found, else undefined
  static async findById(id) {
    const result = await query("SELECT * FROM building WHERE building_id = $1", [id]);
    return result.rows[0];
  }

  // Delete a building by its ID
  // @param {number} id - Building ID
  // @returns {Object|undefined} Deleted building object if found, else undefined
  static async delete(id) {
    const result = await query("DELETE FROM building WHERE building_id = $1 RETURNING *", [id]);
    return result.rows[0];
  }
}
