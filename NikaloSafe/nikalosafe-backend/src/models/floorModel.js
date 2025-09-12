import { query } from "../config/db.js";

export class Floor {
  // Create a new floor
  static async create({ building_id, floor_number, description, num_sensors }) {
    const sql = `
      INSERT INTO floor (building_id, floor_number, description, num_sensors)
      VALUES ($1, $2, $3, $4)
      RETURNING floor_id, building_id, floor_number, description, num_sensors;
    `;

    const values = [building_id, floor_number, description || null, num_sensors || 0];
    const result = await query(sql, values);
    return result.rows[0];
  }

  // Fetch all floors
  static async findAll() {
    const result = await query("SELECT * FROM floor ORDER BY floor_id DESC");
    return result.rows;
  }

  // Fetch floors by building_id
  static async findByBuilding(building_id) {
    const result = await query("SELECT * FROM floor WHERE building_id = $1 ORDER BY floor_number ASC", [building_id]);
    return result.rows;
  }

  // Fetch a floor by ID
  static async findById(id) {
    const result = await query("SELECT * FROM floor WHERE floor_id = $1", [id]);
    return result.rows[0];
  }

  // Delete a floor
  static async delete(id) {
    const result = await query("DELETE FROM floor WHERE floor_id = $1 RETURNING *", [id]);
    return result.rows[0];
  }
}
