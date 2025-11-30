import type {
  User,
  Car,
  Alert,
  IoTDevice,
  OwnerDashboardData,
  CarServiceConfig,
  OwnerSubscription,
  CarLocation,
} from "../domain/types";

const owner: User = {
  id: "u-owner-1",
  name: "Alice Owner",
  email: "alice@example.com",
  role: "CAR_OWNER",
  createdAt: "2025-11-01T10:00:00Z",
};

const carLocations: CarLocation[] = [
  {
    carId: "car-1",
    latitude: 37.3349, // around Cupertino
    longitude: -122.009,
    lastSeenAt: "2025-11-22T18:15:00Z",
  },
  {
    carId: "car-2",
    latitude: 37.7749, // around San Francisco
    longitude: -122.4194,
    lastSeenAt: "2025-11-22T17:50:00Z",
  },
];

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

const carServiceConfigs: CarServiceConfig[] = [
  {
    carId: "car-1",
    services: [
      {
        key: "OUTSIDE_NOISE",
        label: "Outside noise detection",
        description:
          "Detects sirens, collisions, and road emergencies around the car.",
        enabled: true,
      },
      {
        key: "INSIDE_NOISE",
        label: "Inside cabin noise detection",
        description: "Monitors unusual sounds inside the cabin.",
        enabled: true,
      },
      {
        key: "PASSENGER_SOUND",
        label: "Passenger sound detection",
        description:
          "Detects shouting, distress, or abnormal passenger activity.",
        enabled: true,
      },
      {
        key: "ANIMAL_SOUND",
        label: "Animal sound detection",
        description: "Detects barking, meowing, or other animal noises.",
        enabled: false,
      },
      {
        key: "ENGINE_ANOMALY",
        label: "Engine anomaly detection",
        description: "Listens for abnormal engine knock or grinding sounds.",
        enabled: true,
      },
      {
        key: "COLLISION_SOUND",
        label: "Collision sound detection",
        description:
          "Detects sudden impact sounds that may indicate a collision.",
        enabled: true,
      },
    ],
  },
  {
    carId: "car-2",
    services: [
      {
        key: "OUTSIDE_NOISE",
        label: "Outside noise detection",
        description:
          "Detects sirens, collisions, and road emergencies around the car.",
        enabled: true,
      },
      {
        key: "INSIDE_NOISE",
        label: "Inside cabin noise detection",
        description: "Monitors unusual sounds inside the cabin.",
        enabled: false,
      },
      {
        key: "PASSENGER_SOUND",
        label: "Passenger sound detection",
        description:
          "Detects shouting, distress, or abnormal passenger activity.",
        enabled: false,
      },
      {
        key: "ANIMAL_SOUND",
        label: "Animal sound detection",
        description: "Detects barking, meowing, or other animal noises.",
        enabled: false,
      },
      {
        key: "ENGINE_ANOMALY",
        label: "Engine anomaly detection",
        description: "Listens for abnormal engine knock or grinding sounds.",
        enabled: true,
      },
      {
        key: "COLLISION_SOUND",
        label: "Collision sound detection",
        description:
          "Detects sudden impact sounds that may indicate a collision.",
        enabled: true,
      },
    ],
  },
];

const subscription: OwnerSubscription = {
  planId: "PREMIUM",
  planName: "Premium",
  pricePerMonth: 19.99,
  renewalDate: "2025-12-15T00:00:00Z",
  notificationPreferences: [
    {
      channel: "EMAIL",
      label: "Email notifications",
      description: "Receive alerts and summaries via email.",
      enabled: true,
    },
    {
      channel: "SMS",
      label: "SMS notifications",
      description: "Receive critical alerts via text message.",
      enabled: false,
    },
    {
      channel: "PUSH",
      label: "In-app push notifications",
      description: "Receive alerts in the mobile or web app.",
      enabled: true,
    },
  ],
};

export const mockOwnerDashboardData: OwnerDashboardData = {
  owner,
  cars,
  alerts,
  devices,
  carServiceConfigs,
  subscription,
  carLocations,
  aiModels: [
    {
      id: "model-1",
      name: "Engine Noise Classifier",
      type: "Engine audio anomaly detection",
      version: "v1.2.0",
      status: "RUNNING",
      updatedAt: "2025-11-20T10:00:00Z",
    },
    {
      id: "model-2",
      name: "Cabin Voice Detector",
      type: "Passenger / child / pet voice detection",
      version: "v0.9.3",
      status: "TRAINING",
      updatedAt: "2025-11-22T15:30:00Z",
    },
    {
      id: "model-3",
      name: "Glass Break Detector",
      type: "Security event classification",
      version: "v1.0.0",
      status: "OFFLINE",
      updatedAt: "2025-11-18T08:45:00Z",
    },
  ],
  alertTypes: [
    {
      id: "alert-type-1",
      key: "engine_knock",
      name: "Engine knock detected",
      category: "MAINTENANCE",
      defaultSeverity: "WARN",
      description: "Abnormal engine knocking or pinging sound detected.",
      enabled: true,
    },
    {
      id: "alert-type-2",
      key: "tire_squeal",
      name: "Tire squeal",
      category: "SAFETY",
      defaultSeverity: "WARN",
      description:
        "High-friction tire squeal indicating hard braking or sharp turns.",
      enabled: true,
    },
    {
      id: "alert-type-3",
      key: "glass_break",
      name: "Glass break",
      category: "SECURITY",
      defaultSeverity: "CRITICAL",
      description: "Sharp glass breaking sound near or inside the vehicle.",
      enabled: true,
    },
    {
      id: "alert-type-4",
      key: "dog_bark",
      name: "Dog barking",
      category: "ANIMAL",
      defaultSeverity: "INFO",
      description:
        "Dog barking sound detected inside or near the vehicle cabin.",
      enabled: true,
    },
    {
      id: "alert-type-5",
      key: "child_cry",
      name: "Child crying",
      category: "PASSENGER",
      defaultSeverity: "CRITICAL",
      description:
        "Persistent child crying detected inside the cabin; potential safety/comfort issue.",
      enabled: true,
    },
  ],
};
