// models/customerBuildingModel.js
import { query } from "../config/db.js";

export class CustomerBuilding {
  // Create a new customer-building relation
  static async create({ customer_id, building_id, days_of_subscription, start_date, end_date, subscription_status }) {
    const sql = `
      INSERT INTO customer_building (customer_id, building_id, days_of_subscription, start_date, end_date, subscription_status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING customer_building_id, customer_id, building_id, days_of_subscription, start_date, end_date, subscription_status;
    `;
    const values = [customer_id, building_id, days_of_subscription, start_date, end_date, subscription_status || "inactive"];
    const result = await query(sql, values);
    return result.rows[0];
  }

  // Fetch all relations with joined customer & building names
  static async findAll() {
    const sql = `
      SELECT cb.*, c.customer_name, b.building_name
      FROM customer_building cb
      JOIN customer c ON cb.customer_id = c.customer_id
      JOIN building b ON cb.building_id = b.building_id
      ORDER BY cb.customer_building_id DESC;
    `;
    const result = await query(sql);
    return result.rows;
  }

  // Fetch by ID
  static async findById(id) {
    const sql = `
      SELECT cb.*, c.customer_name, b.building_name
      FROM customer_building cb
      JOIN customer c ON cb.customer_id = c.customer_id
      JOIN building b ON cb.building_id = b.building_id
      WHERE cb.customer_building_id = $1;
    `;
    const result = await query(sql, [id]);
    return result.rows[0];
  }

  // Delete relation
  static async delete(id) {
    const result = await query(
      "DELETE FROM customer_building WHERE customer_building_id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }
}
