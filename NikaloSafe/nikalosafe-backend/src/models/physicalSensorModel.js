// models/physicalSensorModel.js
import { query } from "../config/db.js";

export class PhysicalSensor {
  // Insert a single sensor
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

  // Insert multiple sensors in bulk
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

  // Fetch all sensors
  static async findAll() {
    const sql = `
      SELECT * FROM physical_sensor ORDER BY sensor_id ASC
    `;
    const result = await query(sql);
    return result.rows;
  }

  // Fetch sensors by floor
  static async findByFloor(floor_id) {
    const sql = `
      SELECT * FROM physical_sensor WHERE floor_id = $1 ORDER BY sensor_id ASC
    `;
    const result = await query(sql, [floor_id]);
    return result.rows;
  }

  // Fetch sensor by ID
  static async findById(sensor_id) {
    const sql = `
      SELECT * FROM physical_sensor WHERE sensor_id = $1
    `;
    const result = await query(sql, [sensor_id]);
    return result.rows[0];
  }

  // Delete sensor by ID
  static async delete(sensor_id) {
    const sql = `
      DELETE FROM physical_sensor WHERE sensor_id = $1 RETURNING *
    `;
    const result = await query(sql, [sensor_id]);
    return result.rows[0];
  }
}
