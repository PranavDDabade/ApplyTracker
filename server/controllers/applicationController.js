const mongoose = require("mongoose");
const Application = require("../models/Application");
const { createError } = require("../middleware/errorHandler");

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Find an application by ID and throw a 404 if it doesn't exist.
 * Controllers call this instead of repeating the lookup + null-check.
 */
const findOrFail = async (id) => {
  const app = await Application.findById(id);
  if (!app) {
    throw createError(`Application not found with ID: ${id}`, 404);
  }
  return app;
};

// ─── Controllers ──────────────────────────────────────────────────────────────

/**
 * GET /api/applications
 *
 * Query params:
 *   q       — case-insensitive search across company, position, location
 *   status  — exact match on status enum
 *   page    — page number (default 1)
 *   limit   — items per page (default 10, max 100)
 *   sort    — field to sort by (default "applicationDate")
 *   order   — "asc" | "desc" (default "desc")
 */
const getApplications = async (req, res) => {
  const {
    q,
    status,
    page = 1,
    limit = 10,
    sort = "applicationDate",
    order = "desc",
  } = req.query;

  // ── Build filter ────────────────────────────────────────────────────────────
  const filter = {};

  if (q) {
    const regex = new RegExp(q, "i"); // case-insensitive
    filter.$or = [
      { company: regex },
      { position: regex },
      { location: regex },
    ];
  }

  if (status) {
    // Validate status value before hitting the DB
    if (!Application.ALLOWED_STATUSES.includes(status)) {
      throw createError(
        `Invalid status "${status}". Must be one of: ${Application.ALLOWED_STATUSES.join(", ")}`,
        400
      );
    }
    filter.status = status;
  }

  // ── Pagination ──────────────────────────────────────────────────────────────
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  // ── Sorting ─────────────────────────────────────────────────────────────────
  const SORTABLE_FIELDS = [
    "applicationDate",
    "company",
    "position",
    "status",
    "createdAt",
    "updatedAt",
  ];
  const sortField = SORTABLE_FIELDS.includes(sort) ? sort : "applicationDate";
  const sortOrder = order === "asc" ? 1 : -1;

  // ── Query ───────────────────────────────────────────────────────────────────
  const [applications, total] = await Promise.all([
    Application.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limitNum),
    Application.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  return res.status(200).json({
    success: true,
    data: applications,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    },
  });
};

/**
 * GET /api/applications/:id
 * Returns a single application.
 */
const getApplicationById = async (req, res) => {
  const application = await findOrFail(req.params.id);
  return res.status(200).json({ success: true, data: application });
};

/**
 * POST /api/applications
 * Creates a new application. Required body fields: company, position.
 */
const createApplication = async (req, res) => {
  const { company, position, location, status, applicationDate, jobUrl, notes } =
    req.body;

  // Explicit presence check so the error message is clear, even before
  // Mongoose validation fires.
  if (!company || !company.toString().trim()) {
    throw createError("Company name is required", 400);
  }
  if (!position || !position.toString().trim()) {
    throw createError("Position is required", 400);
  }

  const application = await Application.create({
    company,
    position,
    location,
    status,
    applicationDate,
    jobUrl,
    notes,
  });

  return res.status(201).json({ success: true, data: application });
};

/**
 * PATCH /api/applications/:id
 * Partially updates an application. Only provided fields are changed.
 */
const updateApplication = async (req, res) => {
  // Confirm the document exists first
  await findOrFail(req.params.id);

  // Whitelist updatable fields to prevent mass-assignment issues
  const UPDATABLE = [
    "company",
    "position",
    "location",
    "status",
    "applicationDate",
    "jobUrl",
    "notes",
  ];

  const updates = {};
  UPDATABLE.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  if (Object.keys(updates).length === 0) {
    throw createError("No valid fields provided for update", 400);
  }

  // runValidators: true — re-runs schema validators on the updated fields
  const updated = await Application.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  return res.status(200).json({ success: true, data: updated });
};

/**
 * DELETE /api/applications/:id
 * Permanently removes an application. Returns 204 No Content on success.
 */
const deleteApplication = async (req, res) => {
  await findOrFail(req.params.id);
  await Application.findByIdAndDelete(req.params.id);
  return res.status(204).send();
};

/**
 * GET /api/dashboard/stats
 *
 * Returns:
 *   total — total application count
 *   byStatus — count for each allowed status value
 *   recentApplications — last 5 applications (most recently created)
 */
const getDashboardStats = async (req, res) => {
  const [aggregation, recentApplications] = await Promise.all([
    // Single aggregation pass: count total and group by status
    Application.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]),
    Application.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("company position status applicationDate"),
  ]);

  // Build a status map pre-filled with 0 so every status key is always present
  const byStatus = Application.ALLOWED_STATUSES.reduce((acc, s) => {
    acc[s] = 0;
    return acc;
  }, {});

  let total = 0;
  aggregation.forEach(({ _id, count }) => {
    if (_id in byStatus) {
      byStatus[_id] = count;
      total += count;
    }
  });

  return res.status(200).json({
    success: true,
    data: {
      total,
      byStatus,
      recentApplications,
    },
  });
};

module.exports = {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
  getDashboardStats,
};
