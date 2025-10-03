import { query } from "../config/db.js";

export class Floor {
  /**
   * Create a new floor record
   * @param {Object} params - Floor details
   * @param {number} params.building_id - ID of the building this floor belongs to
   * @param {number} params.floor_number - Number of the floor
   * @param {string} [params.description] - Optional description of the floor
   * @param {number} [params.num_sensors] - Number of sensors on the floor (default 0)
   * @returns {Promise<Object>} Newly created floor object
   */
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

  /**
   * Fetch all floors
   * @returns {Promise<Array<Object>>} List of all floors ordered by newest first
   */
  static async findAll() {
    const result = await query("SELECT * FROM floor ORDER BY floor_id DESC");
    return result.rows;
  }

  /**
   * Fetch floors by building ID
   * @param {number} building_id - ID of the building
   * @returns {Promise<Array<Object>>} List of floors belonging to the building
   */
  static async findByBuilding(building_id) {
    const result = await query(
      "SELECT * FROM floor WHERE building_id = $1 ORDER BY floor_number ASC",
      [building_id]
    );
    return result.rows;
  }

  /**
   * Fetch a floor by its ID
   * @param {number} id - ID of the floor
   * @returns {Promise<Object>} Floor object or undefined if not found
   */
  static async findById(id) {
    const result = await query("SELECT * FROM floor WHERE floor_id = $1", [id]);
    return result.rows[0];
  }

  /**
   * Delete a floor by ID
   * @param {number} id - ID of the floor to delete
   * @returns {Promise<Object>} Deleted floor object or undefined if not found
   */
  static async delete(id) {
    const result = await query("DELETE FROM floor WHERE floor_id = $1 RETURNING *", [id]);
    return result.rows[0];
  }
}
