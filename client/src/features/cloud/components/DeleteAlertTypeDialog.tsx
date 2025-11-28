import { AlertSeverityBadge } from "@/components/status/AlertSeverityBadge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { AlertTypeDef } from "@/domain/types";

interface DeleteAlertTypeDialogProps {
  open: boolean;
  alertType: AlertTypeDef | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

export function DeleteAlertTypeDialog({
  open,
  alertType,
  onClose,
  onConfirm,
}: DeleteAlertTypeDialogProps) {
  function handleConfirm() {
    if (!alertType) return;
    onConfirm(alertType.id);
    onClose();
  }

  if (!alertType) return;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Alert Type</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove this alert type from the platform?
          </DialogDescription>
        </DialogHeader>

        <Card className="bg-slate-50">
          <CardHeader>
            <CardTitle>{alertType.name}</CardTitle>
            <CardDescription>
              {alertType.key} · {alertType.category} ·{" "}
              {<AlertSeverityBadge severity={alertType.defaultSeverity} />}
            </CardDescription>
          </CardHeader>
        </Card>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleConfirm}>
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
