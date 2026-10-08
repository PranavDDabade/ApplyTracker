import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import useApplications from "../hooks/useApplications.js";
import StatusBadge from "../components/StatusBadge.jsx";
import Spinner from "../components/Spinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import Pagination from "../components/Pagination.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { deleteApplication } from "../services/api.js";

const STATUSES = ["Applied", "Interview", "Technical Round", "Offer", "Rejected"];

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ApplicationsPage() {
  const { applications, pagination, loading, error, params, updateParams, refetch } =
    useApplications();

  const [searchInput, setSearchInput] = useState("");

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      updateParams({ q: searchInput });
    },
    [searchInput, updateParams]
  );

  const handleStatusChange = useCallback(
    (e) => {
      updateParams({ status: e.target.value });
    },
    [updateParams]
  );

  const handleClear = useCallback(() => {
    setSearchInput("");
    updateParams({ q: "", status: "" });
  }, [updateParams]);

  const handlePageChange = useCallback(
    (newPage) => {
      updateParams({ page: newPage });
    },
    [updateParams]
  );

  const hasActiveFilters = params.q || params.status;

  // Delete flow
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteClick = useCallback((app) => {
    setDeleteError(null);
    setPendingDelete(app);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteApplication(pendingDelete._id);
      setPendingDelete(null);
      refetch();
    } catch (err) {
      setDeleteError(err.message || "Failed to delete application");
      setPendingDelete(null);
    } finally {
      setDeleting(false);
    }
  }, [pendingDelete, refetch]);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Applications</h1>
        <Link to="/applications/new" className="btn btn-primary">
          + New Application
        </Link>
      </div>

      {/* Search & Filter bar */}
      <form className="filter-bar" onSubmit={handleSearch}>
        <input
          type="search"
          className="form-input filter-search"
          placeholder="Search company, position, or location…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          aria-label="Search applications"
        />
        <select
          className="form-input filter-status"
          value={params.status}
          onChange={handleStatusChange}
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <div className="filter-btns">
          <button type="submit" className="btn btn-primary">
            Search
          </button>
          {hasActiveFilters && (
            <button type="button" className="btn btn-secondary" onClick={handleClear}>
              Clear
            </button>
          )}
        </div>
      </form>

      {/* Results */}
      {loading ? (
        <Spinner message="Loading applications…" />
      ) : error ? (
        <ErrorMessage message={error} onRetry={refetch} />
      ) : applications.length === 0 ? (
        <div className="empty-state">
          {hasActiveFilters ? (
            <p>No applications match your search.</p>
          ) : (
            <p>No applications yet.</p>
          )}
          {!hasActiveFilters && (
            <Link to="/applications/new" className="btn btn-primary">
              Add your first application
            </Link>
          )}
        </div>
      ) : (
        <>
          {deleteError && (
            <div style={{ marginBottom: "1rem" }}>
              <ErrorMessage message={deleteError} />
            </div>
          )}

          {/* ── Desktop table ── */}
          <div className="table-wrapper">
            <table className="app-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Position</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Applied</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td className="td-company">
                      <Link to={`/applications/${app._id}`}>{app.company}</Link>
                    </td>
                    <td>{app.position}</td>
                    <td className="td-muted">{app.location || "—"}</td>
                    <td>
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="td-muted">{formatDate(app.applicationDate)}</td>
                    <td className="td-actions">
                      <Link
                        to={`/applications/${app._id}`}
                        className="btn btn-secondary btn-sm"
                      >
                        View
                      </Link>
                      <Link
                        to={`/applications/${app._id}/edit`}
                        className="btn btn-secondary btn-sm"
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteClick(app)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Mobile cards ── */}
          <div className="app-card-list">
            {applications.map((app) => (
              <div className="app-card" key={app._id}>
                <div className="app-card-top">
                  <div className="app-card-info">
                    <Link
                      to={`/applications/${app._id}`}
                      className="app-card-company"
                    >
                      {app.company}
                    </Link>
                    <span className="app-card-position">{app.position}</span>
                    {app.location && (
                      <span className="app-card-location">{app.location}</span>
                    )}
                  </div>
                  <StatusBadge status={app.status} />
                </div>
                <div className="app-card-bottom">
                  <span className="app-card-date">
                    Applied {formatDate(app.applicationDate)}
                  </span>
                  <div className="app-card-actions">
                    <Link
                      to={`/applications/${app._id}`}
                      className="btn btn-secondary btn-sm"
                    >
                      View
                    </Link>
                    <Link
                      to={`/applications/${app._id}/edit`}
                      className="btn btn-secondary btn-sm"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteClick(app)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        </>
      )}

      <ConfirmDialog
        isOpen={!!pendingDelete}
        title="Delete Application"
        message={
          pendingDelete
            ? `Delete ${pendingDelete.position} at ${pendingDelete.company}? This cannot be undone.`
            : ""
        }
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPendingDelete(null)}
        confirmLabel={deleting ? "Deleting…" : "Delete"}
      />
    </div>
  );
}
