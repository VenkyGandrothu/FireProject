import express from "express";
import { linkQrToPaths, getPathsForQr } from "../controllers/linkedQrPathController.js";

const router = express.Router();

router.post("/link", linkQrToPaths);
router.get("/qr/:qr_code_id", getPathsForQr);

export default router;


