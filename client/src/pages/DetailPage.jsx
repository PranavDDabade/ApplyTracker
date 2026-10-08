import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge.jsx";
import Spinner from "../components/Spinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { getApplicationById, deleteApplication } from "../services/api.js";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getApplicationById(id);
        if (!cancelled) setApplication(res.data);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load application");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [id]);

  async function handleDelete() {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteApplication(id);
      navigate("/applications");
    } catch (err) {
      setDeleteError(err.message || "Failed to delete application");
      setDeleting(false);
      setShowConfirm(false);
    }
  }

  if (loading) return <Spinner message="Loading application…" />;
  if (error)
    return (
      <div className="page">
        <ErrorMessage message={error} />
        <Link to="/applications" className="btn btn-secondary" style={{ marginTop: "1rem" }}>
          ← Back to Applications
        </Link>
      </div>
    );

  return (
    <div className="page page-narrow">
      {/* Header */}
      <div className="page-header">
        <div>
          <Link to="/applications" className="back-link">
            ← Applications
          </Link>
          <h1 className="page-title detail-title">{application.company}</h1>
          <p className="detail-subtitle">{application.position}</p>
        </div>
        <div className="detail-actions">
          <Link to={`/applications/${id}/edit`} className="btn btn-secondary">
            Edit
          </Link>
          <button
            className="btn btn-danger"
            onClick={() => setShowConfirm(true)}
            disabled={deleting}
          >
            Delete
          </button>
        </div>
      </div>

      {deleteError && <ErrorMessage message={deleteError} />}

      {/* Detail card */}
      <div className="detail-card">
        <div className="detail-grid">
          <div className="detail-field">
            <span className="detail-label">Status</span>
            <span className="detail-value">
              <StatusBadge status={application.status} />
            </span>
          </div>

          <div className="detail-field">
            <span className="detail-label">Location</span>
            <span className="detail-value">{application.location || "—"}</span>
          </div>

          <div className="detail-field">
            <span className="detail-label">Application Date</span>
            <span className="detail-value">
              {formatDate(application.applicationDate)}
            </span>
          </div>

          <div className="detail-field">
            <span className="detail-label">Date Added</span>
            <span className="detail-value">
              {formatDate(application.createdAt)}
            </span>
          </div>

          {application.jobUrl && (
            <div className="detail-field detail-field-full">
              <span className="detail-label">Job URL</span>
              <span className="detail-value">
                <a
                  href={application.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="detail-link"
                >
                  {application.jobUrl}
                </a>
              </span>
            </div>
          )}

          {application.notes && (
            <div className="detail-field detail-field-full">
              <span className="detail-label">Notes</span>
              <span className="detail-value detail-notes">
                {application.notes}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Confirm delete dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        title="Delete Application"
        message={`Are you sure you want to delete the application for ${application.position} at ${application.company}? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
        confirmLabel={deleting ? "Deleting…" : "Delete"}
      />
    </div>
  );
}
