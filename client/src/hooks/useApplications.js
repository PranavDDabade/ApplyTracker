import { useState, useEffect, useCallback } from "react";
import { getApplications } from "../services/api.js";

/**
 * Hook for the applications list page.
 * Manages fetching, search, filter, and pagination state in one place.
 */
export default function useApplications(initialParams = {}) {
  const [params, setParams] = useState({
    q: "",
    status: "",
    page: 1,
    limit: 10,
    sort: "applicationDate",
    order: "desc",
    ...initialParams,
  });

  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getApplications(params);
      setApplications(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const updateParams = useCallback((updates) => {
    setParams((prev) => ({
      ...prev,
      ...updates,
      // Reset to page 1 whenever search/filter changes
      page: updates.page !== undefined ? updates.page : 1,
    }));
  }, []);

  return { applications, pagination, loading, error, params, updateParams, refetch: fetchApplications };
}
