import type { Alert } from "@/domain/types";
import { Badge } from "../ui/badge";

interface AlertSeverityBadgeProps {
  severity: Alert["severity"];
}

const severityStyles: Record<Alert["severity"], string> = {
  INFO: "bg-sky-50 text-sky-700 border-sky-200",
  WARN: "bg-amber-50 text-amber-700 border-amber-200",
  CRITICAL: "bg-rose-50 text-rose-700 border-rose-200",
};

export function AlertSeverityBadge({ severity }: AlertSeverityBadgeProps) {
  return <Badge className={severityStyles[severity]}>{severity}</Badge>;
}
