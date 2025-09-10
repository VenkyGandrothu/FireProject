import express from "express";
import cors from "cors"; // Enable Cross-Origin Resource Sharing
import bodyParser from "body-parser"; // Parse incoming JSON requests

// Import route modules
import customerRoutes from "./routes/customerRoutes.js";
import buildingRoutes from "./routes/buildingRoutes.js";

const app = express(); // Initialize Express app

app.use(cors()); // Allow requests from any origin
app.use(bodyParser.json()); // Parse JSON bodies

// Mount customer routes under /api/customers
app.use("/api/customers", customerRoutes);

// Mount building routes under /api/buildings
app.use("/api/buildings", buildingRoutes);

// Simple root route to test server
app.get("/", (req, res) => res.send("NikaloSafe Backend Running"));

// Export the app instance (to be used in server.js or for testing)
export default app;
