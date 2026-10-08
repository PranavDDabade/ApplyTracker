const mongoose = require("mongoose");

const ALLOWED_STATUSES = [
  "Applied",
  "Interview",
  "Technical Round",
  "Offer",
  "Rejected",
];

const applicationSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },
    position: {
      type: String,
      required: [true, "Position is required"],
      trim: true,
      maxlength: [100, "Position cannot exceed 100 characters"],
    },
    location: {
      type: String,
      trim: true,
      default: "",
      maxlength: [100, "Location cannot exceed 100 characters"],
    },
    status: {
      type: String,
      enum: {
        values: ALLOWED_STATUSES,
        message: `Status must be one of: ${ALLOWED_STATUSES.join(", ")}`,
      },
      default: "Applied",
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    jobUrl: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "Job URL cannot exceed 500 characters"],
      validate: {
        validator(value) {
          // Allow empty string; validate non-empty values as a URL
          if (!value) return true;
          try {
            new URL(value);
            return true;
          } catch {
            return false;
          }
        },
        message: "Job URL must be a valid URL (e.g. https://example.com/job)",
      },
    },
    notes: {
      type: String,
      trim: true,
      default: "",
      maxlength: [2000, "Notes cannot exceed 2000 characters"],
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt
  }
);

// Expose the allowed statuses so other modules can reference them
// without hard-coding the list again.
applicationSchema.statics.ALLOWED_STATUSES = ALLOWED_STATUSES;

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;
