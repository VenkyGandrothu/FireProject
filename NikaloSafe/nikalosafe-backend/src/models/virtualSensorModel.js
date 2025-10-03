import { query } from "../config/db.js";

export class VirtualSensor {
  /**
   * Insert a single virtual sensor into the database
   * @param {Object} params - Virtual sensor details
   * @param {number} params.sensor_id - Associated physical sensor ID (required)
   * @param {number} params.floor_id - Floor ID where the sensor is located (required)
   * @param {string|number} params.virtual_sensor_number - Virtual sensor number/identifier (required)
   * @param {string} [params.animation_status="Normal"] - Optional animation/status of the virtual sensor
   * @returns {Promise<Object>} Newly created virtual sensor object
   * @throws Will throw an error if required fields are missing
   */
  static async create({ sensor_id, floor_id, virtual_sensor_number, animation_status }) {
    if (!sensor_id || !floor_id || !virtual_sensor_number) {
      throw new Error("sensor_id, floor_id, and virtual_sensor_number are required");
    }

    const sql = `
      INSERT INTO virtual_sensor (sensor_id, floor_id, virtual_sensor_number, animation_status)
      VALUES ($1, $2, $3, $4)
      RETURNING virtual_sensor_id, sensor_id, floor_id, virtual_sensor_number, animation_status;
    `;
    const values = [sensor_id, floor_id, virtual_sensor_number, animation_status || "Normal"];
    const result = await query(sql, values);
    return result.rows[0];
  }

  /**
   * Insert multiple virtual sensors in bulk
   * @param {Array<Object>} sensors - Array of virtual sensor objects
   * @returns {Promise<Array<Object>>} Array of newly inserted virtual sensors
   */
  static async createBulk(sensors) {
    if (!sensors || sensors.length === 0) return [];

    const inserted = [];
    for (const sensor of sensors) {
      const s = await VirtualSensor.create(sensor);
      inserted.push(s);
    }
    return inserted;
  }

  /**
   * Fetch all virtual sensors from the database
   * @returns {Promise<Array<Object>>} List of all virtual sensors
   */
  static async findAll() {
    const sql = `SELECT * FROM virtual_sensor ORDER BY virtual_sensor_id ASC`;
    const result = await query(sql);
    return result.rows;
  }

  /**
   * Fetch virtual sensors by floor ID
   * @param {number} floor_id - Floor ID to filter virtual sensors (required)
   * @returns {Promise<Array<Object>>} Array of virtual sensors belonging to the floor
   * @throws Will throw an error if floor_id is not provided
   */
  static async findByFloor(floor_id) {
    if (!floor_id) throw new Error("floor_id is required");
    const sql = `SELECT * FROM virtual_sensor WHERE floor_id = $1 ORDER BY virtual_sensor_id ASC`;
    const result = await query(sql, [floor_id]);
    return result.rows;
  }

  /**
   * Fetch a virtual sensor by its ID
   * @param {number} virtual_sensor_id - Virtual sensor ID (required)
   * @returns {Promise<Object>} Virtual sensor object or undefined if not found
   * @throws Will throw an error if virtual_sensor_id is not provided
   */
  static async findById(virtual_sensor_id) {
    if (!virtual_sensor_id) throw new Error("virtual_sensor_id is required");
    const sql = `SELECT * FROM virtual_sensor WHERE virtual_sensor_id = $1`;
    const result = await query(sql, [virtual_sensor_id]);
    return result.rows[0];
  }

  /**
   * Delete a virtual sensor by its ID
   * @param {number} virtual_sensor_id - Virtual sensor ID (required)
   * @returns {Promise<Object>} Deleted virtual sensor object or undefined if not found
   * @throws Will throw an error if virtual_sensor_id is not provided
   */
  static async delete(virtual_sensor_id) {
    if (!virtual_sensor_id) throw new Error("virtual_sensor_id is required");
    const sql = `DELETE FROM virtual_sensor WHERE virtual_sensor_id = $1 RETURNING *`;
    const result = await query(sql, [virtual_sensor_id]);
    return result.rows[0];
  }
}
