import { query } from "../config/db.js";

// Register one or multiple QR codes
export const registerQRCodes = async (req, res) => {
  try {
    const data = req.body;

    // Check if input is an array → bulk insert
    if (Array.isArray(data)) {
      if (data.length === 0) {
        return res.status(400).json({ message: "No QR codes provided" });
      }

      // Prepare values array for bulk insert
      const values = data.map((qr) => [
        qr.floor_id,
        qr.qr_code_number,
        qr.installed_location || null,
      ]);

      // Generate SQL placeholders dynamically ($1, $2, ... )
      const sql = `
        INSERT INTO qr_code (floor_id, qr_code_number, installed_location)
        VALUES ${values.map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`).join(", ")}
        RETURNING *;
      `;

      // Flatten values array for query execution
      const flatValues = values.flat();

      // Execute query
      const result = await query(sql, flatValues);

      // Log inserted QR codes to console
      console.log("Inserted QR codes (bulk):", result.rows);

      return res.status(201).json({ message: "QR codes registered", qrCodes: result.rows });
    } else {
      // Single QR code registration
      const { floor_id, qr_code_number, installed_location } = data;

      // Validate required fields
      if (!floor_id || !qr_code_number) {
        return res.status(400).json({ message: "floor_id and qr_code_number are required" });
      }

      // SQL query to insert a single QR code
      const sql = `
        INSERT INTO qr_code (floor_id, qr_code_number, installed_location)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
      const result = await query(sql, [floor_id, qr_code_number, installed_location || null]);

      // Log inserted QR code to console
      console.log("Inserted QR code (single):", result.rows[0]);

      return res.status(201).json({ message: "QR code registered", qrCode: result.rows[0] });
    }
  } catch (error) {
    console.error("Error registering QR codes:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Fetch all QR codes
export const getQRCodes = async (req, res) => {
  try {
    const result = await query("SELECT * FROM qr_code");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching QR codes:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Fetch QR codes by floor id
export const getQRCodesByFloor = async (req, res) => {
  try {
    const floorId = Number(req.params.floor_id);
    if (!Number.isFinite(floorId) || floorId <= 0) {
      return res.status(400).json({ message: "Invalid floor id" });
    }
    const result = await query("SELECT * FROM qr_code WHERE floor_id = $1 ORDER BY qr_code_id DESC", [floorId]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching QR codes by floor:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};