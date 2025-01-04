const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./database");

const app = express();
const PORT = 3001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// API endpoint to fetch and increment the number
app.get("/number", async (req, res) => {
  try {
    // Get the current number from the database
    const currentNumber = await db.getCurrentNumber();

    // Increment the number
    const newNumber = currentNumber + 1;

    // Update the number in the database
    await db.updateNumber(newNumber);

    // Send the new number as response
    res.json({ number: newNumber });
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});