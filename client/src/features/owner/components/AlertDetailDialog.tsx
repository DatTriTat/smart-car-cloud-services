import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Alert, IoTDevice } from "@/domain/types";

interface AlertDetailDialogProps {
  alert: Alert | null;
  device: IoTDevice | null;
  open: boolean;
  onClose: () => void;
  onAcknowledge: (alertId: string) => void;
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

function formatAlertType(alertType: string) {
  const words = alertType.toLowerCase().split("_");
  const result = [];
  for (const word of words) {
    result.push(word[0].toUpperCase() + word.slice(1));
  }
  return result.join(" ");
}

export function AlertDetailDialog({
  alert,
  device,
  open,
  onClose,
  onAcknowledge,
}: AlertDetailDialogProps) {
  if (!alert) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Alert Detail</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-sm text-slate-700 mt-2">
          <div className="flex items-center gap-2">
            <Badge className={severityStyles[alert.severity]}>
              {alert.severity}
            </Badge>
            <Badge className={statusStyles[alert.status]}>{alert.status}</Badge>
          </div>

          <div>
            <p className="text-xs text-slate-500">Type</p>
            <p className="font-medium">{formatAlertType(alert.type)}</p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Message</p>
            <p>{alert.message}</p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Detected at</p>
            <p>{new Date(alert.createdAt).toLocaleString()}</p>
          </div>

          {device && (
            <div>
              <p className="text-xs text-slate-500">Triggered by device</p>
              <p className="font-medium">{device.deviceName}</p>
              <p>{device.deviceType}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          {alert.status === "NEW" && (
            <Button onClick={() => onAcknowledge(alert.id)} variant="default">
              Acknowledge
            </Button>
          )}

          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
