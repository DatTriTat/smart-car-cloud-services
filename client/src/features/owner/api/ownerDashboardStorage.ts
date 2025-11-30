import type { OwnerDashboardData } from "@/domain/types";

type StoredAuthTokens = {
  accessToken?: string;
  tokenType?: string;
};

type StoredAuthState = {
  tokens?: StoredAuthTokens;
};

function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";
}

function getAuthHeader() {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem("authUser");
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as StoredAuthState;
    const token = parsed.tokens?.accessToken;
    if (!token) return {};
    const type = parsed.tokens?.tokenType || "Bearer";
    return { Authorization: `${type} ${token}` } as Record<string, string>;
  } catch {
    return {};
  }
}

/**
 * Persist dashboard changes to backend. No local storage.
 */
export async function saveOwnerDashboard(data: OwnerDashboardData) {
  const baseUrl = getApiBaseUrl();
  const authHeader = getAuthHeader();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(authHeader as Record<string, string>),
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
