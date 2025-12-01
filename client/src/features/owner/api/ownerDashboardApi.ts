import type { OwnerDashboardData } from "@/domain/types";
import { getApiBaseUrl } from "@/lib/apiConfig";

type StoredAuthTokens = {
  accessToken?: string;
  tokenType?: string;
};

type StoredAuthUser = {
  id?: string;
  username?: string;
  email?: string;
  role?: string;
};

type StoredAuthState = {
  tokens?: StoredAuthTokens;
  user?: StoredAuthUser;
};

function getAuthState(): StoredAuthState | undefined {
  if (typeof window === "undefined") return undefined;
  const raw = localStorage.getItem("authUser");
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as StoredAuthState;
  } catch {
    return undefined;
  }
}

function getAuthHeader(): Record<string, string> {
  const authState = getAuthState();
  const token = authState?.tokens?.accessToken;
  if (!token) return {};
  const type = authState?.tokens?.tokenType || "Bearer";
  return { Authorization: `${type} ${token}` };
}

function ownerFromAuth(): OwnerDashboardData["owner"] {
  const auth = getAuthState();
  return {
    id: auth?.user?.id || "owner",
    name: auth?.user?.username || "Owner",
    email: auth?.user?.email || "",
    role: "CAR_OWNER",
    createdAt: "",
  };
}

function normalizeOwnerDashboard(
  data: Partial<OwnerDashboardData> | undefined
): OwnerDashboardData {
  const empty: OwnerDashboardData = {
    owner: ownerFromAuth(),
    cars: [],
    alerts: [],
    devices: [],
    carServiceConfigs: [],
    subscription: {
      planId: "BASIC",
      planName: "Basic",
      pricePerMonth: 0,
      renewalDate: "",
      notificationPreferences: [],
    },
    carLocations: [],
    aiModels: [],
    alertTypes: [],
  };

  return {
    ...empty,
    ...data,
    owner: { ...empty.owner, ...(data?.owner ?? {}) },
    cars: data?.cars ?? [],
    alerts: data?.alerts ?? [],
    devices: data?.devices ?? [],
    carServiceConfigs: data?.carServiceConfigs ?? [],
    subscription: data?.subscription ?? empty.subscription,
    carLocations: data?.carLocations ?? [],
    aiModels: data?.aiModels ?? [],
    alertTypes: data?.alertTypes ?? [],
  };
}

export async function fetchOwnerDashboard(
  ownerId: string
): Promise<OwnerDashboardData> {
  const baseUrl = getApiBaseUrl();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...getAuthHeader(),
  };

  try {
    const url = new URL(`${baseUrl}/owner/dashboard`);
    if (ownerId) {
      url.searchParams.set("userId", ownerId);
    }

    const res = await fetch(url.toString(), {
      method: "GET",
      headers,
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(
        body?.message || body?.error || "Failed to load owner dashboard"
      );
    }

    const payload =
      (body?.data as Partial<OwnerDashboardData> | undefined) || body;

    console.log("[ownerDashboard] fetched payload", payload);
    return normalizeOwnerDashboard(payload);
  } catch (err) {
    console.warn(
      "Owner dashboard endpoint unavailable, returning empty data",
      err
    );
    return normalizeOwnerDashboard(undefined);
  }
}
