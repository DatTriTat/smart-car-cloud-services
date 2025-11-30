import type {
  IoTDevice,
  NotificationChannelKey,
  NotificationPreference,
  OwnerDashboardData,
  OwnerSubscription,
} from "@/domain/types";

export function addDevice(
  data: OwnerDashboardData,
  newDevice: IoTDevice
): OwnerDashboardData {
  return {
    ...data,
    devices: [...data.devices, newDevice],
  };
}

export function updateDevice(
  data: OwnerDashboardData,
  updated: IoTDevice
): OwnerDashboardData {
  return {
    ...data,
    devices: data.devices.map((device) =>
      device.id === updated.id ? updated : device
    ),
  };
}

export function deleteDevice(
  data: OwnerDashboardData,
  deviceId: string
): OwnerDashboardData {
  return {
    ...data,
    devices: data.devices.filter((device) => device.id !== deviceId),
  };
}

export function updateSubcriptionPlan(
  data: OwnerDashboardData,
  patch: Pick<OwnerSubscription, "planId" | "planName" | "pricePerMonth">
): OwnerDashboardData {
  return {
    ...data,
    subscription: {
      ...data.subscription,
      ...patch,
    },
  };
}

export function updateChannel(
  data: OwnerDashboardData,
  channel: NotificationChannelKey,
  enabled: boolean
): OwnerDashboardData {
  return {
    ...data,
    subscription: {
      ...data.subscription,
      notificationPreferences: data.subscription.notificationPreferences.map(
        (pref: NotificationPreference) =>
          pref.channel === channel ? { ...pref, enabled } : pref
      ),
    },
  };
}
