import { useState } from "react";

const STATUSES = ["Applied", "Interview", "Technical Round", "Offer", "Rejected"];

/**
 * Shared form component used by both CreatePage and EditPage.
 *
 * Props:
 *   initialValues — object with field values (empty object for create)
 *   onSubmit      — async (formData) => void
 *   submitLabel   — button text (default "Save")
 *   serverError   — top-level error string from the API
 *   fieldErrors   — object of per-field error strings from the API
 */
export default function ApplicationForm({
  initialValues = {},
  onSubmit,
  submitLabel = "Save",
  serverError,
  fieldErrors: serverFieldErrors = {},
}) {
  const today = new Date().toISOString().split("T")[0];

  const [values, setValues] = useState({
    company: initialValues.company || "",
    position: initialValues.position || "",
    location: initialValues.location || "",
    status: initialValues.status || "Applied",
    applicationDate: initialValues.applicationDate
      ? new Date(initialValues.applicationDate).toISOString().split("T")[0]
      : today,
    jobUrl: initialValues.jobUrl || "",
    notes: initialValues.notes || "",
  });

  const [clientErrors, setClientErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Merge server + client errors (client errors shown first on re-submit)
  const fieldErrors = { ...serverFieldErrors, ...clientErrors };

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear the client error for this field as the user types
    if (clientErrors[name]) {
      setClientErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  function validate() {
    const errs = {};
    if (!values.company.trim()) errs.company = "Company name is required";
    if (!values.position.trim()) errs.position = "Position is required";
    if (values.jobUrl.trim()) {
      try {
        new URL(values.jobUrl.trim());
      } catch {
        errs.jobUrl = "Job URL must be a valid URL (e.g. https://example.com/job)";
      }
    }
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setClientErrors(errs);
      return;
    }
    setClientErrors({});
    setSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="app-form" onSubmit={handleSubmit} noValidate>
      {serverError && (
        <div className="form-error-banner" role="alert">
          {serverError}
        </div>
      )}

      {/* Company */}
      <div className="form-group">
        <label htmlFor="company" className="form-label">
          Company <span className="required">*</span>
        </label>
        <input
          id="company"
          name="company"
          type="text"
          className={`form-input${fieldErrors.company ? " input-error" : ""}`}
          value={values.company}
          onChange={handleChange}
          placeholder="e.g. Google"
          maxLength={100}
          aria-describedby={fieldErrors.company ? "company-error" : undefined}
        />
        {fieldErrors.company && (
          <p id="company-error" className="field-error" role="alert">
            {fieldErrors.company}
          </p>
        )}
      </div>

      {/* Position */}
      <div className="form-group">
        <label htmlFor="position" className="form-label">
          Position <span className="required">*</span>
        </label>
        <input
          id="position"
          name="position"
          type="text"
          className={`form-input${fieldErrors.position ? " input-error" : ""}`}
          value={values.position}
          onChange={handleChange}
          placeholder="e.g. Software Engineer"
          maxLength={100}
          aria-describedby={fieldErrors.position ? "position-error" : undefined}
        />
        {fieldErrors.position && (
          <p id="position-error" className="field-error" role="alert">
            {fieldErrors.position}
          </p>
        )}
      </div>

      {/* Location */}
      <div className="form-group">
        <label htmlFor="location" className="form-label">
          Location
        </label>
        <input
          id="location"
          name="location"
          type="text"
          className="form-input"
          value={values.location}
          onChange={handleChange}
          placeholder="e.g. Remote, New York, NY"
          maxLength={100}
        />
      </div>

      {/* Status + Application Date (two columns) */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="status" className="form-label">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="form-input"
            value={values.status}
            onChange={handleChange}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="applicationDate" className="form-label">
            Application Date
          </label>
          <input
            id="applicationDate"
            name="applicationDate"
            type="date"
            className="form-input"
            value={values.applicationDate}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Job URL */}
      <div className="form-group">
        <label htmlFor="jobUrl" className="form-label">
          Job URL
        </label>
        <input
          id="jobUrl"
          name="jobUrl"
          type="url"
          className={`form-input${fieldErrors.jobUrl ? " input-error" : ""}`}
          value={values.jobUrl}
          onChange={handleChange}
          placeholder="https://company.com/careers/job-id"
          maxLength={500}
          aria-describedby={fieldErrors.jobUrl ? "jobUrl-error" : undefined}
        />
        {fieldErrors.jobUrl && (
          <p id="jobUrl-error" className="field-error" role="alert">
            {fieldErrors.jobUrl}
          </p>
        )}
      </div>

      {/* Notes */}
      <div className="form-group">
        <label htmlFor="notes" className="form-label">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          className="form-input form-textarea"
          value={values.notes}
          onChange={handleChange}
          placeholder="Add any notes about this application…"
          maxLength={2000}
          rows={4}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
