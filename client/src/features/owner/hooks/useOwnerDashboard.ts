import type { OwnerDashboardData } from "@/domain/types";
import { getOwnerDashboard } from "@/lib/api/mockOwnerApi";
import { useState, useEffect } from "react";

interface UseOwnerDashboardResult {
  data: OwnerDashboardData | null;
  loading: boolean;
  error: Error | null;
}

export function useOwnerDashboard(ownerId: string): UseOwnerDashboardResult {
  const [data, setData] = useState<OwnerDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    getOwnerDashboard(ownerId)
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [ownerId]);

  return { data, loading, error };
}
