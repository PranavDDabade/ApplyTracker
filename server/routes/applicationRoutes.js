const express = require("express");
const router = express.Router();

const {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
} = require("../controllers/applicationController");

const { asyncHandler } = require("../middleware/errorHandler");
const validateObjectId = require("../middleware/validateObjectId");

// GET  /api/applications         — list with search, filter, pagination
// POST /api/applications         — create
router
  .route("/")
  .get(asyncHandler(getApplications))
  .post(asyncHandler(createApplication));

// GET    /api/applications/:id   — read one
// PATCH  /api/applications/:id   — partial update
// DELETE /api/applications/:id   — delete
router
  .route("/:id")
  .all(validateObjectId)                        // validates ObjectId before any method
  .get(asyncHandler(getApplicationById))
  .patch(asyncHandler(updateApplication))
  .delete(asyncHandler(deleteApplication));

module.exports = router;
