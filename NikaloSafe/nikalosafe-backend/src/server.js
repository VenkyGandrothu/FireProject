import dotenv from "dotenv"; 
dotenv.config(); // Load environment variables from .env file

import app from "./app.js"; // Import Express app

// Get port from environment or default to 5000
const PORT = process.env.PORT || 5000;

// Start the server and listen on the specified port
app.listen(PORT, () => 
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
