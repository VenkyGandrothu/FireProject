import pool, { query } from "../config/db.js";

export class LinkedQrPath {
  static async createLinks(qr_code_id, path_ids) {
    if (!qr_code_id || !Array.isArray(path_ids) || path_ids.length === 0) return [];

    const values = [];
    const placeholders = path_ids.map((pid, i) => {
      values.push(qr_code_id, pid);
      return `($${i * 2 + 1}, $${i * 2 + 2})`;
    });

    const sql = `
      INSERT INTO linked_qr_path (qr_code_id, path_id)
      VALUES ${placeholders.join(", ")}
      ON CONFLICT DO NOTHING
      RETURNING qr_code_id, path_id;
    `;

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query("SET search_path TO core");
      const result = await client.query(sql, values);
      await client.query("COMMIT");
      return result.rows;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  static async getPathsForQr(qr_code_id) {
    const sql = `
      SELECT ep.*
      FROM linked_qr_path l
      JOIN exit_path ep ON ep.path_id = l.path_id
      WHERE l.qr_code_id = $1
      ORDER BY ep.path_id DESC;
    `;
    const result = await query(sql, [qr_code_id]);
    return result.rows;
  }
}


