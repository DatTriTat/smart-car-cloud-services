import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Alert } from "@/domain/types";

interface AlertsSectionProps {
  alerts: Alert[];
}

const severityStyles: Record<Alert["severity"], string> = {
  INFO: "bg-sky-50 text-sky-700 border-sky-200",
  WARN: "bg-amber-50 text-amber-700 border-amber-200",
  CRITICAL: "bg-rose-50 text-rose-700 border-rose-200",
};

const statusStyles: Record<Alert["status"], string> = {
  NEW: "bg-emerald-50 text-emerald-700 border-emerald-200",
  ACKNOWLEDGED: "bg-slate-50 text-slate-700 border-slate-200",
  RESOLVED: "bg-slate-100 text-slate-500 border-slate-300",
};

function formatDate(iso: string) {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatAlertType(alertType: string) {
  const words = alertType.toLowerCase().split("_");
  const result = [];
  for (const word of words) {
    result.push(word[0].toUpperCase() + word.slice(1));
  }
  return result.join(" ");
}

export function AlertsSection({ alerts }: AlertsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alerts</CardTitle>
        <CardDescription>
          Showing {alerts.length} alert{alerts.length === 1 ? "" : "s"} for this
          car
        </CardDescription>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">
            No alerts for this car in the recent period.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts
                .slice()
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell className="align-top text-xs text-slate-600">
                      {formatDate(alert.createdAt)}
                    </TableCell>
                    <TableCell className="align-top text-xs font-medium text-slate-800">
                      {formatAlertType(alert.type)}
                    </TableCell>
                    <TableCell className="align-top">
                      <Badge
                        className={`text-[10px] ${
                          severityStyles[alert.severity]
                        }`}
                      >
                        {alert.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="align-top">
                      <Badge
                        className={`text-[10px] ${statusStyles[alert.status]}`}
                      >
                        {alert.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="align-top text-slate-700">
                      {alert.message}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
