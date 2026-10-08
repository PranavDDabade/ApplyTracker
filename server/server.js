const dns = require("dns");

// Fix MongoDB Atlas SRV DNS resolution
dns.setServers([
  "1.1.1.1",
  "8.8.8.8",
]);

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const applicationRoutes = require("./routes/applicationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const { errorHandler } = require("./middleware/errorHandler");

// ─── Verify environment ────────────────────────────────────────────────────────
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is not defined in .env");
  process.exit(1);
}

console.log(
  "MongoDB host:",
  new URL(process.env.MONGO_URI).hostname
);

// ─── Database ──────────────────────────────────────────────────────────────────
connectDB();

// ─── App setup ─────────────────────────────────────────────────────────────────
const app = express();

// ─── Core middleware ───────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ─── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/applications", applicationRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ─── Health check ───────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ApplyTrack API is running",
  });
});

// ─── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ─── Centralized error handler ─────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `ApplyTrack API running on port ${PORT} [${process.env.NODE_ENV || "development"}]`
  );
});