import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import type { AiModeStatus } from "@/domain/types";
import {
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, type FormEvent } from "react";

interface AddModelDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (payload: {
    name: string;
    type: string;
    version: string;
    status: AiModeStatus;
  }) => void;
}

export function AddModelDialog({ open, onClose, onSave }: AddModelDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [version, setVersion] = useState("");
  const [status, setStatus] = useState<AiModeStatus>("RUNNING");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !type.trim()) return;

    onSave({
      name: name.trim(),
      type: type.trim(),
      version: version.trim() || "v1.0.0",
      status,
    });

    setName("");
    setType("");
    setVersion("");
    setStatus("RUNNING");
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add AI Model</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel>Model name</FieldLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Engine Noise Classifier"
              />
            </Field>

            <Field>
              <FieldLabel>Model type</FieldLabel>
              <Input
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="Engine audio anomaly detection"
              />
            </Field>

            <Field>
              <FieldLabel>Version</FieldLabel>
              <Input
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="v1.0.0"
              />
            </Field>

            <Field>
              <FieldLabel>Status</FieldLabel>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as AiModeStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select Status</SelectLabel>
                    <SelectItem value="RUNNING">Running</SelectItem>
                    <SelectItem value="TRAINING">Training</SelectItem>
                    <SelectItem value="OFFLINE">Offline</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Add Model</Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
