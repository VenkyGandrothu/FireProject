import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

// Import routes
import customerRoutes from "./routes/customerRoutes.js";
import buildingRoutes from "./routes/buildingRoutes.js";
import floorRoutes from "./routes/floorRoutes.js";
import customerBuildingRoutes from "./routes/customerBuildingRoutes.js";
import physicalSensorRoutes from "./routes/physicalSensorRoutes.js";
import virtualSensorRoutes from "./routes/virtualSensorRoutes.js";
import exitPathRoutes from "./routes/exitPathRoutes.js";
import qrCodeRoutes from "./routes/qrCodeRoutes.js";
import linkedQrPathRoutes from "./routes/linkedQrPathRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json()); // you could just use express.json()

// Routes
app.use("/api/customers", customerRoutes);
app.use("/api/buildings", buildingRoutes);
app.use("/api/floors", floorRoutes);
app.use("/api/customer-building", customerBuildingRoutes);
app.use("/api/sensors", physicalSensorRoutes);
app.use("/api/virtual-sensors", virtualSensorRoutes);
app.use("/api/exit-paths", exitPathRoutes);
app.use("/api/qr-codes", qrCodeRoutes);
app.use("/api/linked-qr-path", linkedQrPathRoutes);

// Root test route
app.get("/", (req, res) => res.send("NikaloSafe Backend Running"));

export default app;
