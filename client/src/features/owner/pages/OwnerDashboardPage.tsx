import { OwnerLayout } from "@/features/owner/components/OwnerLayout";
import { CarSummaryCard } from "@/features/owner/components/CarSummaryCard";
import type {
  CarServiceConfig,
  Alert,
  IntelligenceServiceKey,
} from "@/domain/types";
import { AlertsSection } from "../components/AlertsSection";
import { DevicesSection } from "../components/DevicesSection";
import { useOwnerDashboard } from "../hooks/useOwnerDashboard";
import { AlertDetailDialog } from "../components/AlertDetailDialog";
import { useEffect, useState } from "react";
import { OwnerServiceConfigSection } from "../components/OwnerServiceConfigSection";
import { AlertsFilterBar } from "../components/AlertsFilterBar";
import type { AlertSeverityFilter } from "../components/AlertsFilterBar";
import Loading from "@/components/shared/Loading";
import Error from "@/components/shared/Error";

export function OwnerDashboardPage() {
  const ownerId = "u-owner-1";
  const { data, isLoading, error } = useOwnerDashboard(ownerId);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [serviceConfigs, setServiceConfigs] = useState<CarServiceConfig[]>([]);
  const [severityFilter, setSeverityFilter] =
    useState<AlertSeverityFilter>("ALL");
  const [alertSearch, setAlertSearch] = useState<string>("");

  useEffect(() => {
    if (data?.carServiceConfigs) {
      setServiceConfigs(data.carServiceConfigs);
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
