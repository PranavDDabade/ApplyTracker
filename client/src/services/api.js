/**
 * API service layer for ApplyTrack.
 *
 * All communication with the Express backend goes through here.
 * Components and hooks never call fetch() directly.
 *
 * The Vite dev server proxies /api → http://localhost:5000,
 * so all paths here are relative (no hardcoded host).
 */

const BASE = "/api";

/**
 * Shared fetch wrapper.
 * - Always sends/expects JSON.
 * - On non-OK responses, extracts the server's error message and throws.
 */
async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  // 204 No Content (DELETE success) — nothing to parse
  if (res.status === 204) return null;

  const data = await res.json();

  if (!res.ok) {
    // Use the server's message if available, else a generic fallback
    const message = data?.message || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.fieldErrors = data?.errors || null;
    throw err;
  }

  return data;
}

// ─── Applications ─────────────────────────────────────────────────────────────

/**
 * Fetch a paginated, searchable, filterable list of applications.
 *
 * @param {object} params
 * @param {string}  params.q       - Search query (company / position / location)
 * @param {string}  params.status  - Filter by status
 * @param {number}  params.page    - Page number (1-indexed)
 * @param {number}  params.limit   - Items per page
 * @param {string}  params.sort    - Sort field
 * @param {string}  params.order   - "asc" | "desc"
 */
export function getApplications(params = {}) {
  const query = new URLSearchParams();
  if (params.q)      query.set("q", params.q);
  if (params.status) query.set("status", params.status);
  if (params.page)   query.set("page", params.page);
  if (params.limit)  query.set("limit", params.limit);
  if (params.sort)   query.set("sort", params.sort);
  if (params.order)  query.set("order", params.order);

  const qs = query.toString();
  return request(`/applications${qs ? `?${qs}` : ""}`);
}

/**
 * Fetch a single application by ID.
 * @param {string} id
 */
export function getApplicationById(id) {
  return request(`/applications/${id}`);
}

/**
 * Create a new application.
 * @param {object} payload
 */
export function createApplication(payload) {
  return request("/applications", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Partially update an application.
 * @param {string} id
 * @param {object} payload - Only the fields to update
 */
export function updateApplication(id, payload) {
  return request(`/applications/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

/**
 * Delete an application.
 * @param {string} id
 */
export function deleteApplication(id) {
  return request(`/applications/${id}`, { method: "DELETE" });
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

/**
 * Fetch dashboard statistics.
 * Returns { total, byStatus, recentApplications }
 */
export function getDashboardStats() {
  return request("/dashboard/stats");
}
