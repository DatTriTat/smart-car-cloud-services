import { AlertSeverityBadge } from "@/components/status/AlertSeverityBadge";
import { AlertStatusBadge } from "@/components/status/AlertStatusBadge";
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
import { capitalize, formatDate } from "@/utils";

interface AlertsSectionProps {
  alerts: Alert[];
  onSelectAlert: (alert: Alert) => void;
}

export function AlertsSection({ alerts, onSelectAlert }: AlertsSectionProps) {
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
          <div className="text-slate-500">
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
                  <TableRow
                    key={alert.id}
                    onClick={() => onSelectAlert(alert)}
                    className="hover:cursor-pointer"
                  >
                    <TableCell className="text-slate-500">
                      {formatDate(alert.createdAt)}
                    </TableCell>
                    <TableCell className="font-medium text-slate-700">
                      {alert.type
                        ? capitalize(String(alert.type))
                        : alert.alertType
                        ? capitalize(String(alert.alertType))
                        : "Unknown"}
                    </TableCell>
                    <TableCell>
                      <AlertSeverityBadge severity={alert.severity} />
                    </TableCell>
                    <TableCell>
                      <AlertStatusBadge status={alert.status} />
                    </TableCell>
                    <TableCell className="text-slate-700">
                      {alert.description}
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
