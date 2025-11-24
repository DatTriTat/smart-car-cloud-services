import { OwnerLayout } from "@/features/owner/components/OwnerLayout";
import { CarSummaryCard } from "@/features/owner/components/CarSummaryCard";
import type { Alert } from "@/domain/types";
import { AlertsSection } from "../components/AlertsSection";
import { DevicesSection } from "../components/DevicesSection";
import { useOwnerDashboard } from "../hooks/useOwnerDashboard";
import { AlertDetailDialog } from "../components/AlertDetailDialog";
import { useState } from "react";

export function OwnerDashboardPage() {
  const ownerId = "u-owner-1";
  const { data, loading, error } = useOwnerDashboard(ownerId);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-sm text-slate-500">Loading owner dashboard...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-sm text-rose-600">
          Failed to load dashboard. {error?.message}
        </div>
      </div>
    );
  }

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

        return (
          <div className="space-y-6">
            <CarSummaryCard
              car={selectedCar}
              totalAlerts={totalAlerts}
              criticalAlerts={criticalAlerts}
            />

            <AlertsSection
              alerts={carAlerts}
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

            <pre className="bg-white p-4 rounded border text-xs text-slate-700">
              {JSON.stringify(
                { alerts: carAlerts, devices: carDevices },
                null,
                2
              )}
            </pre>
          </div>
        );
      }}
    </OwnerLayout>
  );
}
