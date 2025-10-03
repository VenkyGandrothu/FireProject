import { query } from "../config/db.js";

export class PhysicalSensor {
  /**
   * Insert a single physical sensor
   * @param {Object} params - Sensor details
   * @param {number} params.floor_id - ID of the floor the sensor belongs to
   * @param {string|number} params.sensor_number - Sensor number/identifier
   * @param {string} [params.location] - Optional location description
   * @param {string} params.type - Type of the sensor
   * @param {string} params.sensor_status - Status of the sensor (e.g., active/inactive)
   * @returns {Promise<Object>} Newly created sensor object
   */
  static async create({ floor_id, sensor_number, location, type, sensor_status }) {
    const sql = `
      INSERT INTO physical_sensor (floor_id, sensor_number, location, type, sensor_status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING sensor_id, floor_id, sensor_number, location, type, sensor_status;
    `;
    const values = [
      floor_id,
      sensor_number,
      location || null,
      type,
      sensor_status,
    ];
    const result = await query(sql, values);
    return result.rows[0];
  }

  /**
   * Insert multiple sensors in bulk
   * @param {number} floor_id - ID of the floor for all sensors
   * @param {Array<Object>} sensors - Array of sensor objects
   * @returns {Promise<Array<Object>>} Array of inserted sensor objects
   */
  static async createBulk(floor_id, sensors) {
    const inserted = [];

    for (const sensor of sensors) {
      const s = await PhysicalSensor.create({
        floor_id,
        sensor_number: sensor.sensor_number,
        location: sensor.location || null,
        type: sensor.type,
        sensor_status: sensor.sensorStatus,
      });
      inserted.push(s);
    }

    return inserted;
  }

  /**
   * Fetch all sensors
   * @returns {Promise<Array<Object>>} List of all physical sensors
   */
  static async findAll() {
    const sql = `
      SELECT * FROM physical_sensor ORDER BY sensor_id ASC
    `;
    const result = await query(sql);
    return result.rows;
  }

  /**
   * Fetch sensors by floor ID
   * @param {number} floor_id - Floor ID to filter sensors
   * @returns {Promise<Array<Object>>} Array of sensors belonging to the floor
   */
  static async findByFloor(floor_id) {
    const sql = `
      SELECT * FROM physical_sensor WHERE floor_id = $1 ORDER BY sensor_id ASC
    `;
    const result = await query(sql, [floor_id]);
    return result.rows;
  }

  /**
   * Fetch a sensor by its ID
   * @param {number} sensor_id - Sensor ID
   * @returns {Promise<Object>} Sensor object or undefined if not found
   */
  static async findById(sensor_id) {
    const sql = `
      SELECT * FROM physical_sensor WHERE sensor_id = $1
    `;
    const result = await query(sql, [sensor_id]);
    return result.rows[0];
  }

  /**
   * Delete a sensor by ID
   * @param {number} sensor_id - Sensor ID to delete
   * @returns {Promise<Object>} Deleted sensor object or undefined if not found
   */
  static async delete(sensor_id) {
    const sql = `
      DELETE FROM physical_sensor WHERE sensor_id = $1 RETURNING *
    `;
    const result = await query(sql, [sensor_id]);
    return result.rows[0];
  }
}
