import { OwnerLayout } from "@/features/owner/components/OwnerLayout";
import { CarSummaryCard } from "@/features/owner/components/CarSummaryCard";
import type {
  CarServiceConfig,
  Alert,
  IntelligenceServiceKey,
  OwnerSubscription,
  NotificationChannelKey,
  PlanId,
} from "@/domain/types";
import { AlertsSection } from "../components/AlertsSection";
import { DevicesSection } from "../components/DevicesSection";
import { useOwnerDashboard } from "../hooks/useOwnerDashboard";
import { AlertDetailDialog } from "../components/AlertDetailDialog";
import { useEffect, useState } from "react";
import { OwnerServiceConfigSection } from "../components/OwnerServiceConfigSection";
import { OwnerPlanCard } from "../components/OwnerPlanCard";
import { OwnerNotificationPreferencesSection } from "../components/OwnerNotificationPreferencesSection";
import { AlertsFilterBar } from "../components/AlertsFilterBar";
import type { AlertSeverityFilter } from "../components/AlertsFilterBar";
import Loading from "@/components/shared/Loading";
import Error from "@/components/shared/Error";
import { OWNER_PLANS } from "../config/ownerPlans";
import { PlanUpgradeDialog } from "../components/PlanUpgradeDialog";

export function OwnerDashboardPage() {
  const ownerId = "u-owner-1";
  const { data, isLoading, error } = useOwnerDashboard(ownerId);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [serviceConfigs, setServiceConfigs] = useState<CarServiceConfig[]>([]);
  const [subscription, setSubscription] = useState<OwnerSubscription | null>(
    null
  );
  const [severityFilter, setSeverityFilter] =
    useState<AlertSeverityFilter>("ALL");
  const [alertSearch, setAlertSearch] = useState<string>("");
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);

  useEffect(() => {
    if (data?.carServiceConfigs) {
      setServiceConfigs(data.carServiceConfigs);
    }

    if (data?.subscription) {
      setSubscription(data.subscription);
    }
  }, [data]);

  function handleSelectAlert(alert: Alert) {
    setSelectedAlert(alert);
    setDialogOpen(true);
  }

  function handleAcknowledge(alertId: string) {
    const updatedAlerts = alerts.map((a) =>
      a.id === alertId ? { ...a, status: "ACKNOWLEDGED" } : a
    );

    data.alerts = updatedAlerts;
    setSelectedAlert((prev) =>
      prev ? { ...prev, status: "ACKNOWLEDGED" } : prev
    );
  }

  function handleToggleService(
    carId: string,
    key: IntelligenceServiceKey,
    enabled: boolean
  ) {
    setServiceConfigs((prev) =>
      prev.map((cfg) =>
        cfg.carId !== carId
          ? cfg
          : {
              ...cfg,
              services: cfg.services.map((s) =>
                s.key === key ? { ...s, enabled } : s
              ),
            }
      )
    );
  }

  function handleToggleChannel(
    channel: NotificationChannelKey,
    enabled: boolean
  ) {
    setSubscription((prev) =>
      prev
        ? {
            ...prev,
            notificationPreferences: prev.notificationPreferences.map((pref) =>
              pref.channel === channel ? { ...pref, enabled } : pref
            ),
          }
        : prev
    );
  }

  function handleConfirmPlan(planId: PlanId) {
    const plan = OWNER_PLANS.find((p) => p.id === planId);
    if (!plan) return;

    setSubscription((prev) =>
      prev
        ? {
            ...prev,
            planId: plan.id,
            planName: plan.name,
            pricePerMonth: plan.pricePerMonth,
          }
        : prev
    );
  }

  if (isLoading) return <Loading />;

  if (error || !data) return <Error error={error} />;

  const { cars, alerts, devices } = data;

  return (
    <OwnerLayout>
      {(selectedCarId) => {
        const selectedCar = cars.find((c) => c.id === selectedCarId)!; // ! for removing warning
        const carAlerts = alerts.filter(
          (alert) => alert.carId === selectedCarId
        );
        const carDevices = devices.filter(
          (device) => device.carId === selectedCarId
        );

        const totalAlerts = carAlerts.length;
        const criticalAlerts = carAlerts.filter(
          (a: Alert) => a.severity === "CRITICAL"
        ).length;

        const filteredAlerts = carAlerts.filter((alert) => {
          const severityOk =
            severityFilter === "ALL" || alert.severity === severityFilter;

          const query = alertSearch.trim().toLowerCase();
          if (!query) return severityOk;

          const haystack = `${alert.type} ${alert.message}`.toLowerCase();
          return severityOk && haystack.includes(query);
        });

        return (
          <div className="space-y-6">
            <CarSummaryCard
              car={selectedCar}
              totalAlerts={totalAlerts}
              criticalAlerts={criticalAlerts}
            />

            <AlertsFilterBar
              severity={severityFilter}
              onChangeSeverity={setSeverityFilter}
              searchQuery={alertSearch}
              onChangeSearch={setAlertSearch}
              totalCount={carAlerts.length}
              filteredCount={filteredAlerts.length}
            />

            <AlertsSection
              alerts={filteredAlerts}
              onSelectAlert={handleSelectAlert}
            />

            <DevicesSection devices={carDevices} />

            <AlertDetailDialog
              alert={selectedAlert}
              device={
                selectedAlert
                  ? carDevices.find(
                      (device) => device.id === selectedAlert.deviceId
                    ) || null
                  : null
              }
              open={dialogOpen}
              onClose={() => setDialogOpen(false)}
              onAcknowledge={handleAcknowledge}
            />

            {/* Plan + notification preferences side by side */}
            {subscription && (
              <div className="grid gap-6 md:grid-cols-2">
                <OwnerPlanCard
                  subscription={subscription}
                  onUpgrade={() => setIsPlanDialogOpen(true)}
                />

                <OwnerNotificationPreferencesSection
                  preferences={subscription.notificationPreferences}
                  onToggleChannel={handleToggleChannel}
                />
              </div>
            )}

            {subscription && (
              <PlanUpgradeDialog
                open={isPlanDialogOpen}
                currentPlanId={subscription.planId}
                onClose={() => setIsPlanDialogOpen(false)}
                onConfirm={handleConfirmPlan}
              />
            )}

            <OwnerServiceConfigSection
              carId={selectedCar.id}
              configs={serviceConfigs}
              onToggleService={handleToggleService}
            />
          </div>
        );
      }}
    </OwnerLayout>
  );
}
