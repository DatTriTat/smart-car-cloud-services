import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IoTDevice, DeviceType } from "@/domain/types";
import { useEffect, useState, type FormEvent } from "react";

interface EditDeviceDialogProps {
  open: boolean;
  device: IoTDevice | null;
  onClose: () => void;
  onSave: (device: IoTDevice) => void;
}

export function EditDeviceDialog({
  open,
  device,
  onClose,
  onSave,
}: EditDeviceDialogProps) {
  const [deviceName, setDeviceName] = useState("");
  const [deviceType, setDeviceType] = useState("AUDIO");
  const [status, setStatus] = useState<"ONLINE" | "OFFLINE">("ONLINE");

  useEffect(() => {
    if (open && device) {
      setDeviceName(device.deviceName);
      setDeviceType(device.deviceType);
      setStatus(device.status === "ONLINE" ? "ONLINE" : "OFFLINE");
    }
  }, [open, device]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!device || !deviceName.trim()) return;

    onSave({
      ...device,
      deviceName: deviceName.trim(),
      deviceType: deviceType as DeviceType,
      status,
    });

    onClose();
  }

  console.log(deviceType);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Device</DialogTitle>
        </DialogHeader>
        {device && (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <label className="block text-slate-500 mb-1">Device name</label>
              <Input
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                className="h-10"
              />
            </div>

            <div>
              <label className="block text-slate-500 mb-1">Device type</label>
              <Select
                value={deviceType}
                onValueChange={(value) => setDeviceType(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={deviceType} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Device Type</SelectLabel>
                    <SelectItem value="AUDIO">Audio Sensor</SelectItem>
                    <SelectItem value="CAMERA">Camera</SelectItem>
                    <SelectItem value="MICROPHONE">Microphone</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-slate-500 mb-1">Status</label>
              <Select
                value={status}
                onValueChange={(value) =>
                  setStatus(value === "ONLINE" ? "ONLINE" : "OFFLINE")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Device Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Device Status</SelectLabel>
                    <SelectItem value="ONLINE">Online</SelectItem>
                    <SelectItem value="OFFLINE">Offline</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>

              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
