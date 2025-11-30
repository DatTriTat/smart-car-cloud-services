import type { Alert } from "@/domain/types";
import { Badge } from "../ui/badge";

interface AlertStatusBadgeProps {
  status: Alert["status"];
}

const statusStyles: Record<Alert["status"], string> = {
  NEW: "bg-emerald-50 text-emerald-700 border-emerald-200",
  ACKNOWLEDGED: "bg-slate-50 text-slate-700 border-slate-200",
  RESOLVED: "bg-slate-100 text-slate-500 border-slate-300",
};

export function AlertStatusBadge({ status }: AlertStatusBadgeProps) {
  return <Badge className={statusStyles[status]}>{status}</Badge>;
}
