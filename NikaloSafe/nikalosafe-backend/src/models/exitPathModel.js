// src/models/exitPathModel.js
import pool, { query } from "../config/db.js";

export class ExitPath {
  /**
   * Create a single exit path
   * @param {Object} params
   * @param {number} params.floor_id
   * @param {string} params.start_point
   * @param {string} params.end_point
   * @param {string} params.path_status
   * @param {number|string} params.path_length
   * @returns {Promise<Object>} Newly created exit path
   */
  static async create({ floor_id, start_point, end_point, path_status, path_length }) {
    const sql = `
      INSERT INTO exit_path (floor_id, start_point, end_point, path_status, path_length)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [floor_id, start_point, end_point, path_status, parseFloat(path_length)];
    const result = await query(sql, values);
    return result.rows[0];
  }

  /**
   * Bulk insert multiple exit paths
   * @param {Array<Object>} paths
   * @returns {Promise<Array<Object>>} Array of newly inserted exit paths
   */
  static async createBulk(paths) { // <-- make it static!
    if (!paths || paths.length === 0) return [];

    const values = [];
    const placeholders = paths.map((p, index) => {
      const i = index * 5;
      values.push(p.floor_id, p.start_point, p.end_point, p.path_status, parseFloat(p.path_length));
      return `($${i + 1}, $${i + 2}, $${i + 3}, $${i + 4}, $${i + 5})`;
    });

    const sql = `
      INSERT INTO exit_path (floor_id, start_point, end_point, path_status, path_length)
      VALUES ${placeholders.join(", ")}
      RETURNING *;
    `;

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      // Ensure schema is set correctly for this transaction
      await client.query("SET search_path TO core");
      const result = await client.query(sql, values);
      await client.query("COMMIT");
      return result.rows;
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("ExitPath createBulk error:", err);
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Fetch all exit paths
   * @returns {Promise<Array<Object>>}
   */
  static async findAll() {
    const result = await query("SELECT * FROM exit_path ORDER BY path_id DESC");
    return result.rows;
  }

  /**
   * Fetch exit path by ID
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  static async findById(id) {
    const result = await query("SELECT * FROM exit_path WHERE path_id = $1", [id]);
    return result.rows[0];
  }

  /**
   * Delete exit path by ID
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  static async delete(id) {
    const result = await query(
      "DELETE FROM exit_path WHERE path_id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }

  /**
   * Fetch exit paths by building (optional, if building_id is stored)
   * @param {number} building_id
   * @returns {Promise<Array<Object>>}
   */
  static async findByBuilding(building_id) {
    const sql = `
      SELECT ep.*
      FROM exit_path ep
      INNER JOIN floor f ON ep.floor_id = f.floor_id
      WHERE f.building_id = $1
      ORDER BY ep.path_id DESC
    `;
    const result = await query(sql, [building_id]);
    return result.rows;
  }

  // Fetch exit paths by floor
  static async findByFloor(floor_id) {
    const result = await query(
      "SELECT * FROM exit_path WHERE floor_id = $1 ORDER BY path_id DESC",
      [floor_id]
    );
    return result.rows;
  }
}
