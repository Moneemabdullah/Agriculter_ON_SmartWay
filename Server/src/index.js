// server.js
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const cron = require("node-cron");
const connectDB = require("./config/db.config");

// Import Routes
const authRoutes = require("./routes/auth.routes");
const sensorRoutes = require("./routes/sensor.routes");

// Import Controller for Cron Job
const { calculateDailyAverage } = require("./controllers/sensor.controller");

// Load environment variables
dotenv.config();

// Initialize app
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB()
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => {
        console.error("Database connection failed:", err);
        process.exit(1);
    });

// Base Route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to Agriculture On SmartWay API",
    });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/sensor", sensorRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Server Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
});

//* Daily Cron Job (Midnight)
cron.schedule("0 0 * * *", async () => {
    console.log("Running daily average calculation...");
    try {
        await calculateDailyAverage();
        console.log("Daily average calculation completed successfully!");
    } catch (err) {
        console.error("Error during daily average calculation:", err.message);
    }
});

// Start Server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
