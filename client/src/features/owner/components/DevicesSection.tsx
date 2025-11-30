import { DeviceStatusBadge } from "@/components/status/DeviceStatusBadge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { IoTDevice } from "@/domain/types";
import { formatDate } from "@/utils";

interface DevicesSectionProps {
  devices: IoTDevice[];
}

function formatType(deviceType: IoTDevice["deviceType"]) {
  return deviceType.charAt(0) + deviceType.slice(1).toLowerCase();
}

export function DevicesSection({ devices }: DevicesSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>IoT Devices</CardTitle>
        <CardDescription>
          {devices.length === 0
            ? "No devices connected to this car"
            : `Showing ${devices.length} device${
                devices.length === 1 ? "" : "s"
              } for this car`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {devices.length === 0 ? (
          <div>Ask your IoT team to register devices for this vehicle.</div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {devices.map((device) => (
              <div
                key={device.id}
                className="border border-slate-200 rounded-md p-3 flex flex-col gap-2 bg-slate-50/60"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-slate-900 line-clamp-1">
                      {device.deviceName}
                    </p>
                    <p className="text-slate-500">
                      {formatType(device.deviceType)}
                    </p>
                  </div>
                  <DeviceStatusBadge status={device.status} />
                </div>
                <p className="text-sm text-slate-500">
                  Connected since {formatDate(device.createdAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
