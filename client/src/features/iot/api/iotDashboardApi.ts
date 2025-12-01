import type { Alert, Car, IoTDevice } from "@/domain/types";
import { getApiBaseUrl } from "@/lib/apiConfig";

export interface IotDashboardData {
  cars: Car[];
  devices: IoTDevice[];
  alerts: Alert[];
}

export async function fetchIotDashboard(): Promise<IotDashboardData> {
  const baseUrl = getApiBaseUrl();
  const raw =
    typeof window !== "undefined" ? localStorage.getItem("authUser") : null;
  const token = raw ? (JSON.parse(raw) as any)?.tokens?.accessToken : null;

  const res = await fetch(`${baseUrl}/iot/dashboard`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.message || "Failed to load IoT dashboard");
  }

  const data = (body?.data ?? {}) as Partial<IotDashboardData>;
  console.log("[iotDashboard] fetched payload", data);
  return {
    cars: data.cars ?? [],
    devices: data.devices ?? [],
    alerts: data.alerts ?? [],
  };
}
