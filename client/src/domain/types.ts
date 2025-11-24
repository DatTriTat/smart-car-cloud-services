// ---- User ----
export type UserRole = "CAR_OWNER" | "CLOUD_STAFF" | "IOT_TEAM";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string; // ISO timestamp
}

// ---- CAR ----
export type CarStatus = "ACTIVE" | "INACTIVE" | "MAINTENANCE";

export interface Car {
  id: string;
  ownerId: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  status: CarStatus;
  createdAt: string;
}

// ---- IoT Device ----
export type DeviceType = "MICROPHONE" | "CAMERA";
export type DeviceStatus = "ONLINE" | "OFFLINE" | "ERROR";

export interface IoTDevice {
  id: string;
  carId: string;
  deviceType: DeviceType;
  deviceName: string;
  status: DeviceStatus;
  createdAt: string;
}

// ---- Alerts ----
export type AlertSeverity = "INFO" | "WARN" | "CRITICAL";
export type AlertStatus = "NEW" | "ACKNOWLEDGED" | "RESOLVED";

export interface Alert {
  id: string;
  carId: string;
  deviceId?: string;
  type: string;
  severity: AlertSeverity;
  status: AlertStatus;
  message: string;
  confidenceScore: number;
  createdAt: string;
  acknowledgedAt?: string;
}

// ---- Intelligence services ----
export type IntelligenceServiceKey =
  | "OUTSIDE_NOISE"
  | "INSIDE_NOISE"
  | "PASSENGER_SOUND"
  | "ANIMAL_SOUND"
  | "ENGINE_ANOMALY"
  | "COLLISION_SOUND";

export interface CarServiceConfig {
  carId: string;
  services: {
    key: IntelligenceServiceKey;
    label: string;
    description: string;
    enabled: boolean;
  }[];
}

// ---- Owner Dashboard aggregate ----
export interface OwnerDashboardData {
  owner: User;
  cars: Car[];
  alerts: Alert[];
  devices: IoTDevice[];
  carServiceConfigs: CarServiceConfig[];
}
