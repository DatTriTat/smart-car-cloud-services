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
import type { IoTDevice } from "@/domain/types";
import { useEffect, useState, type FormEvent } from "react";

interface AddDeviceDialogProps {
  open: boolean;
  carId: string;
  onClose: () => void;
  onSave: (device: Omit<IoTDevice, "id">) => void;
}

export function AddDeviceDialog({
  open,
  carId,
  onClose,
  onSave,
}: AddDeviceDialogProps) {
  const [deviceName, setDeviceName] = useState("");
  const [deviceType, setDeviceType] = useState("AUDIO");
  const [status, setStatus] = useState<"ONLINE" | "OFFLINE">("ONLINE");

  useEffect(() => {
    setDeviceName("");
    setDeviceType("AUDIO");
    setStatus("ONLINE");
  }, [open]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!deviceName.trim()) return;

    onSave({
      carId,
      deviceName: deviceName.trim(),
      deviceType,
      status,
    });

    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Device</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="block text-slate-500 mb-1">Device name</label>
            <Input
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              placeholder="Front cabin mic"
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
                <SelectValue placeholder="Select Device Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Device Type</SelectLabel>
                  <SelectItem value="AUDIO">Audio Sensor</SelectItem>
                  <SelectItem value="CAMERA">Camera</SelectItem>
                  <SelectItem value="MIC">Microphone</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
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

            <Button type="submit">Save Device</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
