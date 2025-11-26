import type { PlanId } from "@/domain/types";
import { useEffect, useState } from "react";
import { OWNER_PLANS, type PlanOption } from "../config/ownerPlans";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PlanUpgradeDialogProps {
  open: boolean;
  currentPlanId: PlanId;
  onClose: () => void;
  onConfirm: (planId: PlanId) => void;
}

export function PlanUpgradeDialog({
  open,
  currentPlanId,
  onClose,
  onConfirm,
}: PlanUpgradeDialogProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>(currentPlanId);

  useEffect(() => {
    if (open) {
      setSelectedPlanId(currentPlanId);
    }
  }, [open, currentPlanId]);

  function handleConfirm() {
    onConfirm(selectedPlanId);
    onClose();
  }

  function getPlanById(id: PlanId): PlanOption {
    const plan = OWNER_PLANS.find((p) => p.id === id);
    if (!plan) {
      throw new Error(`Unknown plan id: ${id}`);
    }

    return plan;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Change plan
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-3 md:grid-cols-3 mt-2">
          {OWNER_PLANS.map((plan) => {
            const isCurrent = plan.id === currentPlanId;
            const isSelected = plan.id === selectedPlanId;
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlanId(plan.id)}
                className={`text-left flex flex-col justify-around border rounded-lg p-3 bg-white transition ${
                  isSelected
                    ? "border-slate-900 shadow-sm"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <CardHeader className="p-0 mb-2">
                  <CardTitle className="font-semibold text-slate-900">
                    {plan.name}
                    {isCurrent && (
                      <p className="text-emerald-600 mt-2">Current plan</p>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 text-slate-600 space-y-1">
                  <p className="font-medium text-slate-900">
                    {plan.pricePerMonth === 0
                      ? "Free"
                      : `$${plan.pricePerMonth.toFixed(2)}/month`}
                  </p>

                  <p className="mb-4">{plan.description}</p>

                  {plan.features.slice(0, 3).map((f) => (
                    <p key={f} className="text-sm text-slate-500 mt-2">
                      • {f}
                    </p>
                  ))}
                </CardContent>
              </button>
            );
          })}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm change</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
