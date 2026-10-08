import { useState, useEffect } from "react";
import { getDashboardStats } from "../services/api.js";

/**
 * Hook for fetching dashboard statistics.
 */
export default function useDashboardStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getDashboardStats();
        if (!cancelled) setStats(res.data);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load statistics");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();
    return () => { cancelled = true; };
  }, []);

  return { stats, loading, error };
}
