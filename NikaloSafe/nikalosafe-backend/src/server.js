import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { initializeDatabase } from "./utils/dbInit.js";

const PORT = process.env.PORT || 5000;

// Initialize database on startup
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}✅`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
