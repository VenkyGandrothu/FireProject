// controllers/exitPathController.js
import { ExitPath } from "../models/exitPathModel.js";

const VALID_STATUSES = ["Open", "Closed"];

export const registerExitPaths = async (req, res) => {
  try {
    // Accept either array body or { paths: [...] }
    const body = req.body && Array.isArray(req.body.paths) ? req.body.paths : req.body;
    const data = Array.isArray(body) ? body : [body];

    if (!data || data.length === 0) {
      return res.status(400).json({ message: "No exit paths provided" });
    }

    const validPaths = [];
    const errors = [];

    data.forEach((p, idx) => {
      const index = idx + 1;

      const floor_id = p.floor_id;
      const start_point = typeof p.start_point === "string" ? p.start_point.trim() : "";
      const end_point = typeof p.end_point === "string" ? p.end_point.trim() : "";
      const path_status = typeof p.path_status === "string" ? p.path_status.trim() : "";
      const path_length_raw = p.path_length;

      // Validate floor_id
      if (floor_id === undefined || floor_id === null || Number.isNaN(Number(floor_id))) {
        errors.push(`Path ${index}: floor_id is required and must be a number`);
      }

      if (!start_point) errors.push(`Path ${index}: start_point is required`);
      if (!end_point) errors.push(`Path ${index}: end_point is required`);
      if (!path_status) {
        errors.push(`Path ${index}: path_status is required`);
      } else if (!VALID_STATUSES.includes(path_status)) {
        errors.push(`Path ${index}: path_status must be one of ${VALID_STATUSES.join(", ")}`);
      }

      const path_length = Number(path_length_raw);
      if (!Number.isFinite(path_length) || path_length <= 0) {
        errors.push(`Path ${index}: path_length must be a positive number`);
      }

      // If all ok, push to validPaths with normalized types
      if (
        floor_id !== undefined &&
        !Number.isNaN(Number(floor_id)) &&
        start_point &&
        end_point &&
        path_status &&
        VALID_STATUSES.includes(path_status) &&
        Number.isFinite(path_length) &&
        path_length > 0
      ) {
        validPaths.push({
          floor_id: Number(floor_id),
          start_point,
          end_point,
          path_status,
          path_length,
        });
      }
    });

    if (validPaths.length === 0) {
      // Return 400 with details
      return res.status(400).json({ message: "No valid exit paths provided", errors });
    }

    // Insert valid paths in bulk
    const insertedPaths = await ExitPath.createBulk(validPaths);

    res.status(201).json({
      message: "Exit paths registered successfully",
      exitPaths: insertedPaths,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    // Log full stack for debugging
    console.error("registerExitPaths error:", err && err.stack ? err.stack : err);
    res.status(500).json({ message: "Internal Server Error", details: err.message });
  }
};

/**
 * Fetch all exit paths
 */
export const getAllExitPaths = async (req, res) => {
  try {
    const exitPaths = await ExitPath.findAll();
    // Keep response shape consistent with other controllers
    res.json({ exitPaths });
  } catch (err) {
    console.error("getAllExitPaths error:", err && err.stack ? err.stack : err);
    const errMsg = (err && err.message) ? err.message : "Internal Server Error";
    res.status(500).json({ message: errMsg });
  }
};

// Fetch exit paths by floor id
export const getExitPathsByFloor = async (req, res) => {
  try {
    const floorId = Number(req.params.floor_id);
    if (!Number.isFinite(floorId) || floorId <= 0) {
      return res.status(400).json({ message: "Invalid floor id" });
    }
    const exitPaths = await ExitPath.findByFloor(floorId);
    res.json({ exitPaths });
  } catch (err) {
    console.error("getExitPathsByFloor error:", err && err.stack ? err.stack : err);
    const errMsg = (err && err.message) ? err.message : "Internal Server Error";
    res.status(500).json({ message: errMsg });
  }
};

/**
 * Fetch exit path by ID
 */
export const getExitPathById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid exit path id" });
    }

    const exitPath = await ExitPath.findById(id);
    if (!exitPath) return res.status(404).json({ message: "Exit path not found" });

    res.json({ exitPath });
  } catch (err) {
    console.error("getExitPathById error:", err && err.stack ? err.stack : err);
    const errMsg = (err && err.message) ? err.message : "Internal Server Error";
    res.status(500).json({ message: errMsg });
  }
};

/**
 * Delete exit path by ID
 */
export const deleteExitPath = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid exit path id" });
    }

    const exitPath = await ExitPath.delete(id);
    if (!exitPath) return res.status(404).json({ message: "Exit path not found" });

    res.json({ message: "Exit path deleted successfully", exitPath });
  } catch (err) {
    console.error("deleteExitPath error:", err && err.stack ? err.stack : err);
    const errMsg = (err && err.message) ? err.message : "Internal Server Error";
    res.status(500).json({ message: errMsg });
  }
};
