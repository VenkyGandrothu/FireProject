import { LinkedQrPath } from "../models/linkedQrPathModel.js";

export const linkQrToPaths = async (req, res) => {
  try {
    const body = req.body || {};
    const qr_code_id = Number(body.qr_code_id);
    const path_ids = Array.isArray(body.path_ids) ? body.path_ids.map(Number).filter((n) => Number.isFinite(n) && n > 0) : [];

    if (!Number.isFinite(qr_code_id) || qr_code_id <= 0) {
      return res.status(400).json({ message: "qr_code_id is required and must be a positive number" });
    }
    if (path_ids.length === 0) {
      return res.status(400).json({ message: "path_ids must be a non-empty array of positive numbers" });
    }

    const links = await LinkedQrPath.createLinks(qr_code_id, path_ids);
    return res.status(201).json({ message: "Links created", links });
  } catch (err) {
    console.error("linkQrToPaths error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPathsForQr = async (req, res) => {
  try {
    const qr_code_id = Number(req.params.qr_code_id);
    if (!Number.isFinite(qr_code_id) || qr_code_id <= 0) {
      return res.status(400).json({ message: "Invalid qr_code_id" });
    }
    const paths = await LinkedQrPath.getPathsForQr(qr_code_id);
    return res.json({ paths });
  } catch (err) {
    console.error("getPathsForQr error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


