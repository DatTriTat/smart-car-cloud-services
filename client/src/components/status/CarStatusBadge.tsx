import type { Car } from "@/domain/types";
import { Badge } from "../ui/badge";

interface CarStatusBadgeProps {
  status: Car["status"];
}

const statusColorMap: Record<Car["status"], string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700 border-emerald-200",
  INACTIVE: "bg-slate-100 text-slate-700 border-slate-200",
  MAINTENANCE: "bg-amber-100 text-amber-700 border-amber-200",
};

export function CarStatusBadge({ status }: CarStatusBadgeProps) {
  return <Badge className={statusColorMap[status]}>{status}</Badge>;
}
