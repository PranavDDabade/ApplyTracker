const express = require("express");
const router = express.Router();

const { getDashboardStats } = require("../controllers/applicationController");
const { asyncHandler } = require("../middleware/errorHandler");

// GET /api/dashboard/stats
router.get("/stats", asyncHandler(getDashboardStats));

module.exports = router;
