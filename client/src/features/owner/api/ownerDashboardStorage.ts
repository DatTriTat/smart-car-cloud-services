import type { OwnerDashboardData } from "@/domain/types";
import { getApiBaseUrl } from "@/lib/apiConfig";

function getAuthHeader(): Record<string, string> | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("authUser");
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as {
      tokens?: { accessToken?: string; tokenType?: string };
    };
    const token = parsed.tokens?.accessToken;
    if (!token) return null;
    return { Authorization: `Bearer ${token}` };
  } catch {
    return null;
  }
}

export async function saveOwnerDashboard(data: OwnerDashboardData) {
  const baseUrl = getApiBaseUrl();
  const authHeader = getAuthHeader();
  if (!authHeader) return;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...authHeader,
  };

  try {
    await fetch(`${baseUrl}/owner/dashboard`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.warn("Failed to persist owner dashboard", err);
  }
}
