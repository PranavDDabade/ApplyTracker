/**
 * Renders a coloured pill badge for an application status.
 */
const STATUS_CLASS = {
  Applied: "badge-applied",
  Interview: "badge-interview",
  "Technical Round": "badge-technical",
  Offer: "badge-offer",
  Rejected: "badge-rejected",
};

export default function StatusBadge({ status }) {
  const cls = STATUS_CLASS[status] || "badge-applied";
  return <span className={`badge ${cls}`}>{status}</span>;
}
