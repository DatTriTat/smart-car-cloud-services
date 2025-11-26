import Loading from "@/components/shared/Loading";
import { useOwnerDashboard } from "../hooks/useOwnerDashboard";
import Error from "@/components/shared/Error";
import { OwnerLayout } from "../components/OwnerLayout";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { OwnerPlanCard } from "../components/OwnerPlanCard";
import { OwnerNotificationPreferencesSection } from "../components/OwnerNotificationPreferencesSection";
import type {
  NotificationChannelKey,
  NotificationPreference,
  PlanId,
} from "@/domain/types";
import { useState } from "react";
import { PlanUpgradeDialog } from "../components/PlanUpgradeDialog";
import { useQueryClient } from "@tanstack/react-query";
import { OWNER_PLANS } from "../config/ownerPlans";
import { saveOwnerDashboard } from "../api/ownerDashboardStorage";

export function OwnerAccountPage() {
  const ownerId = "u-owner-1";
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useOwnerDashboard(ownerId);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);

  function handleToggleChannel(
    channel: NotificationChannelKey,
    enabled: boolean
  ) {
    queryClient.setQueryData(["ownerDashboard", ownerId], (oldData: any) => {
      if (!oldData) return oldData;

      const newData = {
        ...oldData,
        subscription: {
          ...oldData.subscription,
          notificationPreferences:
            oldData.subscription.notificationPreferences.map(
              (pref: NotificationPreference) =>
                pref.channel === channel ? { ...pref, enabled } : pref
            ),
        },
      };

      saveOwnerDashboard(newData); // Simulate update backend here

      return newData;
    });
  }

  function handleConfirmPlan(planId: PlanId) {
    const plan = OWNER_PLANS.find((p) => p.id === planId);
    if (!plan) return;

    queryClient.setQueryData(["ownerDashboard", ownerId], (oldData: any) => {
      if (!oldData) return oldData;

      const newData = {
        ...oldData,
        subscription: {
          ...oldData.subscription,
          planId: plan.id,
          planName: plan.name,
          pricePerMonth: plan.pricePerMonth,
        },
      };

      saveOwnerDashboard(newData); // Simulate update backend here

      return newData;
    });
  }

  if (isLoading) return <Loading />;

  if (error || !data) return <Error error={error} />;

  const { owner, cars, subscription, devices, alerts } = data;

  const totalCars = cars.length;
  const totalDevices = devices.length;
  const totalAlerts = alerts.length;
  const criticalAlerts = alerts.filter((a) => a.severity === "CRITICAL").length;

  return (
    <OwnerLayout>
      {() => (
        <div className="space-y-6">
          {/* Account info */}
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-700">
              <div>
                <p className="text-slate-500">Name</p>
                <p className="font-medium">{owner.name}</p>
              </div>
              <div>
                <p className="text-slate-500">Email</p>
                <p className="font-medium">{owner.email}</p>
              </div>
              <div>
                <p className="text-slate-500">Current plan</p>
                <p className="font-medium">{subscription.planName}</p>
              </div>
            </CardContent>
          </Card>

          {/* Usage summary */}
          <Card>
            <CardHeader>
              <CardTitle>Usage Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <span className="text-slate-500">Cars</span>
                <span className="font-medium text-slate-900">{totalCars}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Devices</span>
                <span className="font-medium text-slate-900">
                  {totalDevices}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Alerts</span>
                <span className="font-medium text-slate-900">
                  {totalAlerts}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Critical Alerts</span>
                <span className="font-medium text-rose-600">
                  {criticalAlerts}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Plan + notification preferences side by side */}
          <div className="grid gap-6 md:grid-cols-2">
            <OwnerPlanCard
              subscription={subscription}
              onUpgrade={() => setIsPlanDialogOpen(true)}
            />

            <OwnerNotificationPreferencesSection
              planId={subscription.planId}
              preferences={subscription.notificationPreferences}
              onToggleChannel={handleToggleChannel}
            />

            <PlanUpgradeDialog
              open={isPlanDialogOpen}
              currentPlanId={subscription.planId}
              onClose={() => setIsPlanDialogOpen(false)}
              onConfirm={handleConfirmPlan}
            />
          </div>
        </div>
      )}
    </OwnerLayout>
  );
}
