/**
 * A simple modal confirmation dialog.
 * Props:
 *   isOpen    — boolean
 *   title     — string
 *   message   — string
 *   onConfirm — function called when the user confirms
 *   onCancel  — function called when the user cancels
 *   confirmLabel — label for the confirm button (default "Delete")
 *   danger       — if true, confirm button uses danger styling
 */
export default function ConfirmDialog({
  isOpen,
  title = "Are you sure?",
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Delete",
  danger = true,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div className="modal">
        <h3 id="dialog-title" className="modal-title">
          {title}
        </h3>
        {message && <p className="modal-message">{message}</p>}
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            className={`btn ${danger ? "btn-danger" : "btn-primary"}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
