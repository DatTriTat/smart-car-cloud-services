import type { IoTDevice } from "@/domain/types";
import { Badge } from "../ui/badge";

interface DeviceStatusBadgeProps {
  status: IoTDevice["status"];
}

const statusStyles: Record<IoTDevice["status"], string> = {
  ONLINE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  OFFLINE: "bg-rose-50 text-rose-700 border-rose-200",
  ERROR: "bg-amber-50 text-amber-700 border-amber-200",
};

export function DeviceStatusBadge({ status }: DeviceStatusBadgeProps) {
  return <Badge className={statusStyles[status]}>{status}</Badge>;
}
