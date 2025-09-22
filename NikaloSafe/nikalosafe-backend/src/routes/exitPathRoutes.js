import express from "express";
import { registerExitPaths, getAllExitPaths, getExitPathById, deleteExitPath, getExitPathsByFloor } from "../controllers/exitPathController.js";

const router = express.Router();

// POST /register → single or multiple exit paths
router.post("/register", registerExitPaths);

// GET all exit paths
router.get("/", getAllExitPaths);

// GET exit paths by floor
router.get("/floor/:floor_id", getExitPathsByFloor);

// GET single exit path by ID
router.get("/:id", getExitPathById);

// DELETE exit path by ID
router.delete("/:id", deleteExitPath);

export default router;
