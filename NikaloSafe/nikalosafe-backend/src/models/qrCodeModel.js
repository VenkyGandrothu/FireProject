// src/models/qrCodeModel.js
import pool from "../config/db.js";

export const QRCode = {
  /**
   * Insert a single QR code into the database
   * @param {Object} params - QR code details
   * @param {number} params.floor_id - Floor ID the QR code belongs to
   * @param {string|number} params.qr_code_number - QR code number/identifier
   * @param {string} [params.installed_location] - Optional location description
   * @returns {Promise<Object>} Newly created QR code object
   */
  async create({ floor_id, qr_code_number, installed_location }) {
    const query = `
      INSERT INTO qr_code (floor_id, qr_code_number, installed_location)
      VALUES ($1, $2, $3)
      RETURNING qr_code_id, floor_id, qr_code_number, installed_location;
    `;
    const values = [floor_id, qr_code_number, installed_location || null];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  /**
   * Insert multiple QR codes in bulk
   * @param {Array<Object>} qrCodes - Array of QR code objects
   * @returns {Promise<Array<Object>>} Array of newly inserted QR codes
   */
  async createBulk(qrCodes) {
    if (!qrCodes || qrCodes.length === 0) return [];

    // Normalize and validate input
    const normalized = qrCodes.map((qr) => ({
      floor_id: qr.floor_id,
      qr_code_number: String(qr.qr_code_number).trim(),
      installed_location: qr.installed_location ? String(qr.installed_location).trim() : null,
    }));

    const values = [];
    const placeholders = normalized.map((qr, index) => {
      const i = index * 3;
      values.push(qr.floor_id, qr.qr_code_number, qr.installed_location);
      return `($${i + 1}, $${i + 2}, $${i + 3})`;
    });

    const query = `
      INSERT INTO qr_code (floor_id, qr_code_number, installed_location)
      VALUES ${placeholders.join(", ")}
      RETURNING *;
    `;

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const result = await client.query(query, values);
      await client.query("COMMIT");
      return result.rows;
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("createBulk SQL error:", err);
      throw err;
    } finally {
      client.release();
    }
  },

  /**
   * Fetch all QR codes
   * @returns {Promise<Array<Object>>} List of all QR codes
   */
  async getAll() {
    const result = await pool.query("SELECT * FROM qr_code ORDER BY qr_code_id DESC");
    return result.rows;
  },

  /**
   * Fetch QR codes by floor ID
   * @param {number} floor_id - Floor ID to filter QR codes
   * @returns {Promise<Array<Object>>} Array of QR codes belonging to the floor
   */
  async getByFloor(floor_id) {
    const result = await pool.query(
      "SELECT * FROM qr_code WHERE floor_id = $1 ORDER BY qr_code_id DESC",
      [floor_id]
    );
    return result.rows;
  },
};
