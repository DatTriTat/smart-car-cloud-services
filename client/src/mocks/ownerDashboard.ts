import type {
  User,
  Car,
  Alert,
  IoTDevice,
  OwnerDashboardData,
} from "../domain/types";

const owner: User = {
  id: "u-owner-1",
  name: "Alice Owner",
  email: "alice@example.com",
  role: "CAR_OWNER",
  createdAt: "2025-11-01T10:00:00Z",
};

const cars: Car[] = [
  {
    id: "car-1",
    ownerId: "u-owner-1",
    vin: "5YJ3E1EA6KF123456",
    make: "Tesla",
    model: "Model S",
    year: 2022,
    status: "ACTIVE",
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "car-2",
    ownerId: "u-owner-1",
    vin: "WAUZZZ8V2JA123456",
    make: "Audi",
    model: "A4",
    year: 2020,
    status: "MAINTENANCE",
    createdAt: "2023-06-10T00:00:00Z",
  },
];

const devices: IoTDevice[] = [
  {
    id: "dev-1",
    carId: "car-1",
    deviceType: "MICROPHONE",
    deviceName: "Cabin Mic Front",
    status: "ONLINE",
    createdAt: "2025-11-22T08:00:00Z",
  },
  {
    id: "dev-2",
    carId: "car-1",
    deviceType: "CAMERA",
    deviceName: "Front Camera",
    status: "OFFLINE",
    createdAt: "2025-11-22T09:00:00Z",
  },
  {
    id: "dev-3",
    carId: "car-2",
    deviceType: "MICROPHONE",
    deviceName: "Rear Cabin Mic",
    status: "ONLINE",
    createdAt: "2025-11-22T10:00:00Z",
  },
];

const alerts: Alert[] = [
  {
    id: "alert-1",
    carId: "car-1",
    deviceId: "dev-1",
    type: "PASSENGER_SCREAM",
    severity: "CRITICAL",
    status: "NEW",
    message: "Possible passenger distress detected.",
    confidenceScore: 0.94,
    createdAt: "2025-11-22T18:10:00Z",
  },
  {
    id: "alert-2",
    carId: "car-1",
    deviceId: "dev-2",
    type: "ENGINE_KNOCK",
    severity: "WARN",
    status: "ACKNOWLEDGED",
    message: "Abnormal engine noise detected.",
    confidenceScore: 0.82,
    createdAt: "2025-11-22T17:45:00Z",
    acknowledgedAt: "2025-11-22T17:50:00Z",
  },
  {
    id: "alert-3",
    carId: "car-2",
    deviceId: "dev-3",
    type: "DOG_BARK",
    severity: "INFO",
    status: "NEW",
    message: "Dog bark detected in rear cabin.",
    confidenceScore: 0.76,
    createdAt: "2025-11-22T16:30:00Z",
  },
];

export const mockOwnerDashboardData: OwnerDashboardData = {
  owner,
  cars,
  alerts,
  devices,
};
