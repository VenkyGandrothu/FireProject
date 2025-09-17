import { query } from "../config/db.js";

export class VirtualSensor {
  // Insert a single virtual sensor
  static async create({ sensor_id, floor_id, virtual_sensor_number, animation_status }) {
    const sql = `
      INSERT INTO virtual_sensor (sensor_id, floor_id, virtual_sensor_number, animation_status)
      VALUES ($1, $2, $3, $4)
      RETURNING virtual_sensor_id, sensor_id, floor_id, virtual_sensor_number, animation_status;
    `;
    const values = [sensor_id, floor_id, virtual_sensor_number, animation_status || "Normal"];
    const result = await query(sql, values);
    return result.rows[0];
  }

  // Insert multiple virtual sensors in bulk
  static async createBulk(sensors) {
    const inserted = [];
    for (const sensor of sensors) {
      const s = await VirtualSensor.create(sensor);
      inserted.push(s);
    }
    return inserted;
  }

  // Fetch all virtual sensors
  static async findAll() {
    const sql = `
      SELECT * FROM virtual_sensor ORDER BY virtual_sensor_id ASC
    `;
    const result = await query(sql);
    return result.rows;
  }

  // Fetch virtual sensors by floor
  static async findByFloor(floor_id) {
    const sql = `
      SELECT * FROM virtual_sensor WHERE floor_id = $1 ORDER BY virtual_sensor_id ASC
    `;
    const result = await query(sql, [floor_id]);
    return result.rows;
  }

  // Fetch virtual sensor by ID
  static async findById(virtual_sensor_id) {
    const sql = `
      SELECT * FROM virtual_sensor WHERE virtual_sensor_id = $1
    `;
    const result = await query(sql, [virtual_sensor_id]);
    return result.rows[0];
  }

  // Delete virtual sensor by ID
  static async delete(virtual_sensor_id) {
    const sql = `
      DELETE FROM virtual_sensor WHERE virtual_sensor_id = $1 RETURNING *
    `;
    const result = await query(sql, [virtual_sensor_id]);
    return result.rows[0];
  }
}
