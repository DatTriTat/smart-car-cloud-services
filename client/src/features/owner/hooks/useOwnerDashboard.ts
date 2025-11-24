import type { OwnerDashboardData } from "@/domain/types";
import { getOwnerDashboard } from "@/lib/api/mockOwnerApi";
import { useQuery } from "@tanstack/react-query";

export function useOwnerDashboard(ownerId: string) {
  return useQuery<OwnerDashboardData, Error>({
    queryKey: ["ownerDashboard", ownerId],
    queryFn: () => getOwnerDashboard(ownerId),
    staleTime: 1000 * 30,
  });
}
