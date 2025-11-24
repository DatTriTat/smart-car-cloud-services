import type { OwnerDashboardData } from "@/domain/types";
import { mockOwnerDashboardData } from "@/mocks/ownerDashboard";

export async function getOwnerDashboard(
  ownerId: string
): Promise<OwnerDashboardData> {
  console.log("[mock] getOwnerDashboard called with ownerId:", ownerId);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockOwnerDashboardData);
    }, 400);
  });
}
