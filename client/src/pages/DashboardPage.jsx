import { Link } from "react-router-dom";
import useDashboardStats from "../hooks/useDashboardStats.js";
import Spinner from "../components/Spinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

const STATUS_ORDER = ["Applied", "Interview", "Technical Round", "Offer", "Rejected"];

const STAT_COLORS = {
  Applied: "stat-applied",
  Interview: "stat-interview",
  "Technical Round": "stat-technical",
  Offer: "stat-offer",
  Rejected: "stat-rejected",
};

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function DashboardPage() {
  const { stats, loading, error } = useDashboardStats();

  if (loading) return <Spinner message="Loading dashboard…" />;
  if (error) return <ErrorMessage message={error} />;

  const { total, byStatus, recentApplications } = stats;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <Link to="/applications/new" className="btn btn-primary">
          + New Application
        </Link>
      </div>

      {/* Total */}
      <div className="stat-total-card">
        <span className="stat-total-number">{total}</span>
        <span className="stat-total-label">Total Applications</span>
      </div>

      {/* Per-status grid */}
      <div className="stats-grid">
        {STATUS_ORDER.map((status) => (
          <div key={status} className={`stat-card ${STAT_COLORS[status]}`}>
            <span className="stat-number">{byStatus[status] ?? 0}</span>
            <span className="stat-label">{status}</span>
          </div>
        ))}
      </div>

      {/* Recent applications */}
      <section className="recent-section">
        <div className="section-header">
          <h2 className="section-title">Recent Applications</h2>
          <Link to="/applications" className="section-link">
            View all →
          </Link>
        </div>

        {recentApplications.length === 0 ? (
          <div className="empty-state">
            <p>No applications yet.</p>
            <Link to="/applications/new" className="btn btn-primary">
              Add your first application
            </Link>
          </div>
        ) : (
          <div className="recent-list">
            {recentApplications.map((app) => (
              <Link
                key={app._id}
                to={`/applications/${app._id}`}
                className="recent-item"
              >
                <div className="recent-item-info">
                  <span className="recent-company">{app.company}</span>
                  <span className="recent-position">{app.position}</span>
                </div>
                <div className="recent-item-meta">
                  <StatusBadge status={app.status} />
                  <span className="recent-date">
                    {formatDate(app.applicationDate)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
