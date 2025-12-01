import type { OwnerDashboardData } from "@/domain/types";
import { getApiBaseUrl } from "@/lib/apiConfig";

function ownerFromAuth(): OwnerDashboardData["owner"] {
  if (typeof window === "undefined") {
    return {
      id: "owner",
      name: "Owner",
      email: "",
      role: "CAR_OWNER",
      createdAt: "",
    };
  }

  try {
    const raw = localStorage.getItem("authUser");
    const parsed = raw ? JSON.parse(raw) : null;
    const user = parsed?.user;

    return {
      id: user?.id || "owner",
      name: user?.username || "Owner",
      email: user?.email || "",
      role: "CAR_OWNER",
      createdAt: "",
    };
  } catch {
    return {
      id: "owner",
      name: "Owner",
      email: "",
      role: "CAR_OWNER",
      createdAt: "",
    };
  }
}

function normalizeOwnerDashboard(
  data: Partial<OwnerDashboardData> = {}
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

  const raw =
    typeof window !== "undefined" ? localStorage.getItem("authUser") : null;
  const token = raw ? (JSON.parse(raw) as any)?.tokens?.accessToken : null;

  try {
    const res = await fetch(
      `${baseUrl}/owner/dashboard${ownerId ? `?userId=${ownerId}` : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(
        body?.message || body?.error || "Failed to load owner dashboard"
      );
    }

    const payload = (body?.data ?? {}) as Partial<OwnerDashboardData>;
    console.log("[ownerDashboard] fetched payload", payload);
    return normalizeOwnerDashboard(payload);
  } catch (err) {
    console.warn(
      "Owner dashboard endpoint unavailable, returning empty data",
      err
    );
    return normalizeOwnerDashboard({});
  }
}
