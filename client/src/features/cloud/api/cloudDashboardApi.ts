import type {
  Alert,
  AlertTypeDef,
  Car,
  IoTDevice,
  AiModel,
} from "@/domain/types";
import { authFetch } from "@/lib/authFetch";

export interface CloudDashboardData {
  cars: Car[];
  alerts: Alert[];
  alertTypes: AlertTypeDef[];
  devices: IoTDevice[];
  aiModels: AiModel[];
}

function mapAlertType(dto: any): AlertTypeDef {
  if (!dto) return {};
  const type = dto.type || dto.key;
  return {
    id: type,
    key: type,
    type,
    name:
      dto.name ||
      dto.description ||
      (type ? type.replace(/_/g, " ") : undefined),
    description: dto.description,
    category: dto.category,
    defaultSeverity: dto.defaultSeverity,
    enabled: dto.enabled,
  };
}

export async function fetchCloudDashboard(): Promise<CloudDashboardData> {
  const res = await authFetch("/cloud/dashboard", { method: "GET" });
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(body?.message || "Failed to load cloud dashboard");
  }

  const data = (body?.data ?? {}) as Partial<CloudDashboardData>;
  console.log("Fetched cloud dashboard data:", data);
  return {
    cars: data.cars ?? [],
    alerts: data.alerts ?? [],
    alertTypes: Array.isArray(data.alertTypes)
      ? data.alertTypes.map(mapAlertType)
      : [],
    devices: data.devices ?? [],
    aiModels: data.aiModels ?? [],
  };
}
