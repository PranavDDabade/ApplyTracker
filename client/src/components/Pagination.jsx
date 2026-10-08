/**
 * Simple pagination controls.
 * Props:
 *   pagination — { page, totalPages, hasNextPage, hasPrevPage, total, limit }
 *   onPageChange — (newPage) => void
 */
export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages, total, limit } = pagination;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="pagination">
      <p className="pagination-info">
        Showing {start}–{end} of {total} application{total !== 1 ? "s" : ""}
      </p>
      <div className="pagination-controls">
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          aria-label="First page"
        >
          «
        </button>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => onPageChange(page - 1)}
          disabled={!pagination.hasPrevPage}
          aria-label="Previous page"
        >
          ‹ Prev
        </button>
        <span className="pagination-page">
          Page {page} of {totalPages}
        </span>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => onPageChange(page + 1)}
          disabled={!pagination.hasNextPage}
          aria-label="Next page"
        >
          Next ›
        </button>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          aria-label="Last page"
        >
          »
        </button>
      </div>
    </div>
  );
}
