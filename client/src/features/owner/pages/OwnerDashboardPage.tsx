import { mockOwnerDashboardData } from "@/mocks/ownerDashboard";
import { OwnerLayout } from "@/features/owner/components/OwnerLayout";
import { CarSummaryCard } from "@/features/owner/components/CarSummaryCard";
import type { Alert } from "@/domain/types";
import { AlertsSection } from "../components/AlertsSection";
import { DevicesSection } from "../components/DevicesSection";

export function OwnerDashboardPage() {
  const { cars, alerts, devices } = mockOwnerDashboardData;

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

            <AlertsSection alerts={carAlerts} />

            <DevicesSection devices={carDevices} />

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
