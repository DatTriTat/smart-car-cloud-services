import type { OwnerDashboardData } from "@/domain/types";
import { useQuery } from "@tanstack/react-query";
import { fetchOwnerDashboard } from "../api/ownerDashboardApi";

export function useOwnerDashboard(ownerId: string) {
  return useQuery<OwnerDashboardData, Error>({
    queryKey: ["ownerDashboard", ownerId],
    queryFn: () => fetchOwnerDashboard(ownerId),
    staleTime: 1000 * 30,
  });
}
