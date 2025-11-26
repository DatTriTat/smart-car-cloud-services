import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { IoTDevice } from "@/domain/types";

interface DevicesSectionProps {
  devices: IoTDevice[];
}

const statusStyles: Record<IoTDevice["status"], string> = {
  ONLINE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  OFFLINE: "bg-rose-50 text-rose-700 border-rose-200",
  ERROR: "bg-amber-50 text-amber-700 border-amber-200",
};

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
                  <Badge className={statusStyles[device.status]}>
                    {device.status}
                  </Badge>
                </div>
                <p className="text-sm text-slate-500">
                  Connected since{" "}
                  {new Date(device.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
