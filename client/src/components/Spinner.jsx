export default function Spinner({ message = "Loading…" }) {
  return (
    <div className="spinner-container" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p className="spinner-text">{message}</p>
    </div>
  );
}
