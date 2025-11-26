import type { OwnerDashboardData } from "@/domain/types";
import { loadOwnerDashboard } from "./ownerDashboardStorage";

export async function fetchOwnerDashboard(
  ownerId: string
): Promise<OwnerDashboardData> {
  console.log("[mock] fetchOwnerDashboard called with ownerId:", ownerId);
  await new Promise((resolve) => setTimeout(resolve, 300));
  return loadOwnerDashboard();
}
