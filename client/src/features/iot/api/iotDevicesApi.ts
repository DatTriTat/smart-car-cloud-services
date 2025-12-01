import type { IoTDevice } from "@/domain/types";
import { getApiBaseUrl } from "@/lib/apiConfig";

export async function createIotDevice(
  payload: Omit<IoTDevice, "id">
): Promise<IoTDevice> {
  const raw =
    typeof window !== "undefined" ? localStorage.getItem("authUser") : null;
  const token = raw ? (JSON.parse(raw) as any)?.tokens?.accessToken : null;

  const res = await fetch(`${getApiBaseUrl()}/iot/devices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.message || "Failed to create IoT device");
  }
  return body.data as IoTDevice;
}

export async function updateIotDevice(
  id: string,
  payload: Partial<IoTDevice>
): Promise<IoTDevice> {
  const raw =
    typeof window !== "undefined" ? localStorage.getItem("authUser") : null;
  const token = raw ? (JSON.parse(raw) as any)?.tokens?.accessToken : null;

  const res = await fetch(`${getApiBaseUrl()}/iot/devices/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.message || "Failed to update IoT device");
  }
  return body.data as IoTDevice;
}

export async function deleteIotDevice(id: string): Promise<string> {
  const raw =
    typeof window !== "undefined" ? localStorage.getItem("authUser") : null;
  const token = raw ? (JSON.parse(raw) as any)?.tokens?.accessToken : null;

  const res = await fetch(`${getApiBaseUrl()}/iot/devices/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.message || "Failed to delete IoT device");
  }
  return body.data?.id || id;
}
