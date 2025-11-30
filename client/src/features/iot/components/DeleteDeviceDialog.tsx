import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { IoTDevice } from "@/domain/types";

interface DeleteDeviceDialogProps {
  open: boolean;
  device: IoTDevice | null;
  onClose: () => void;
  onConfirm: (deviceId: string) => void;
}

export function DeleteDeviceDialog({
  open,
  device,
  onClose,
  onConfirm,
}: DeleteDeviceDialogProps) {
  function handleConfirm() {
    if (!device) return;
    onConfirm(device.id);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Remove Device</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove this device from the car?
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 text-slate-700 space-y-2">
          {device && (
            <div className="border border-slate-200 rounded-md px-3 py-2 bg-slate-50">
              <p className="font-medium text-slate-900">{device.deviceName}</p>
              <p className="text-slate-600">
                Type: {device.deviceType} · Status: {device.status}
              </p>
            </div>
          )}
        </div>

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
