import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import type { AiModel } from "@/domain/types";

interface DeleteModelDialogProps {
  open: boolean;
  model: AiModel | null;
  onClose: () => void;
  onConfirm: (modelId: string) => void;
}

export function DeleteModelDialog({
  open,
  model,
  onClose,
  onConfirm,
}: DeleteModelDialogProps) {
  function handleConfirm() {
    if (!model) return;
    onConfirm(model.id);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove AI Model</DialogTitle>
        </DialogHeader>

        <div className="mt-2 text-slate-700 space-y-2">
          <p>Are you sure you want to remove this model from the platform?</p>
        </div>

        {model && (
          <Card className="bg-slate-50">
            <CardHeader>
              <CardTitle>{model.name}</CardTitle>
              <CardDescription>
                {model.type} · {model.version} · {model.status}
              </CardDescription>
            </CardHeader>
          </Card>
        )}

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
