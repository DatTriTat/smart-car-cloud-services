import type { OwnerDashboardData } from "@/domain/types";
import { mockOwnerDashboardData } from "@/mocks/ownerDashboard";

const STORAGE_KEY = "ownerDashboardData";

export function loadOwnerDashboard(): OwnerDashboardData {
  if (typeof window === "undefined") {
    return mockOwnerDashboardData;
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockOwnerDashboardData));
    return mockOwnerDashboardData;
  }

  try {
    return JSON.parse(raw) as OwnerDashboardData;
  } catch {
    return mockOwnerDashboardData;
  }
}

export function saveOwnerDashboard(data: OwnerDashboardData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
