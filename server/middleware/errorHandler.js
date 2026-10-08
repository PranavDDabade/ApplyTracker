const mongoose = require("mongoose");

/**
 * Centralised error-handling middleware.
 *
 * Translates known error types (Mongoose validation, bad ObjectId, duplicate
 * key) into structured 4xx responses. Everything else becomes a 500.
 *
 * Response envelope: { success: false, message: string, errors?: object }
 */
const errorHandler = (err, req, res, next) => {
  // Default values — may be overridden by specific error handling below
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = undefined;

  // ── Mongoose validation error ─────────────────────────────────────────────
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Validation failed";
    // Collect per-field messages so the client can show inline errors
    errors = Object.fromEntries(
      Object.entries(err.errors).map(([field, e]) => [field, e.message])
    );
  }

  // ── Mongoose bad ObjectId (e.g. /api/applications/not-an-id) ─────────────
  else if (err instanceof mongoose.Error.CastError && err.kind === "ObjectId") {
    statusCode = 400;
    message = `Invalid ID format: "${err.value}"`;
  }

  // ── MongoDB duplicate key ──────────────────────────────────────────────────
  else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `Duplicate value for field: ${field}`;
  }

  // In development, log the full stack trace for debugging
  if (process.env.NODE_ENV === "development") {
    console.error(`[${statusCode}] ${message}`, err.stack || err);
  }

  const body = { success: false, message };
  if (errors) body.errors = errors;

  return res.status(statusCode).json(body);
};

/**
 * Tiny helper used in controllers so we don't repeat try/catch on every
 * async route.  Usage: router.get("/", asyncHandler(myController))
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/**
 * Creates a named operational error with an explicit HTTP status code.
 * Use this to signal expected error conditions (e.g. 404 not found).
 */
const createError = (message, statusCode = 500) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

module.exports = { errorHandler, asyncHandler, createError };
