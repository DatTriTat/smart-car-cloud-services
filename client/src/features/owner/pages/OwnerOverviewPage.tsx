import type { Car } from "@/domain/types";
import { useOwnerDashboard } from "../hooks/useOwnerDashboard";
import { OwnerLayout } from "../components/OwnerLayout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import Loading from "@/components/shared/Loading";
import Error from "@/components/shared/Error";
import { capitalize, formatDate } from "@/utils";
import { useAuth } from "@/auth/AuthContext";

export function OwnerOverviewPage() {
  const { user } = useAuth();
  const ownerId = user?.id || "me";
  const { data, isLoading, error } = useOwnerDashboard(ownerId);

  if (isLoading) return <Loading />;

  if (error || !data) return <Error error={error} />;

  const { cars, alerts, devices, carLocations } = data;

  const totalCars = cars.length;
  const totalDevices = devices.length;
  const totalAlerts = alerts.length;

  const criticalAlerts = alerts.filter(
    (alert) => alert.severity === "CRITICAL"
  ).length;
  const activeAlerts = alerts.filter(
    (alert) => alert.status !== "RESOLVED"
  ).length;

  // helper to get per-car data
  function getCarMetrics(car: Car) {
    const carAlerts = alerts.filter((alert) => alert.carId === car.id);
    const carDevices = devices.filter((device) => device.carId === car.id);
    const location = carLocations.find((loc) => loc.carId === car.id);

    const lastAlert =
      carAlerts.length === 0
        ? null
        : carAlerts
            .slice()
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )[0];

    return { carAlerts, carDevices, location, lastAlert };
  }

  return (
    <OwnerLayout cars={cars} ownerName={data.owner?.name}>
      {() => (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xs font-medium text-slate-500 uppercase">
                  Cars
                </CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-semibold text-slate-900">
                {totalCars}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xs font-medium text-slate-500 uppercase">
                  Devices
                </CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-semibold text-slate-900">
                {totalDevices}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xs font-medium text-slate-500 uppercase">
                  Active Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold text-slate-900">
                  {activeAlerts}
                </p>
                <p className="text-xs text-slate-500">
                  {totalAlerts} total alerts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xs font-medium text-slate-500 uppercase">
                  Critical Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-semibold text-rose-600">
                {criticalAlerts}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Cars overview & locations</CardTitle>
              <CardDescription>Click each card to see details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {cars.map((car) => {
                  const { carAlerts, carDevices, location, lastAlert } =
                    getCarMetrics(car);

                  return (
                    <div
                      key={car.id}
                      className="border border-slate-20 rounded-lg p-3 bg-white flex flex-col gap-3"
                    >
                      {/* pseudo map view */}
                      <div className="h-48 rounded-md bg-slate-200 flex items-center justify-center text-xs text-slate-600">
                        {location ? (
                          <div className="text-center space-y-1">
                            <div className="font-medium">
                              Map preview (mock)
                            </div>
                            <div>
                              {Number.isFinite(Number(location.latitude)) &&
                              Number.isFinite(Number(location.longitude)) ? (
                                <>
                                  Lat: {Number(location.latitude).toFixed(3)}, Lng:{" "}
                                  {Number(location.longitude).toFixed(3)}
                                </>
                              ) : (
                                <span>Location unavailable</span>
                              )}
                            </div>
                            <div className="text-slate-500">
                              Last seen: {formatDate(location.lastSeenAt)}
                            </div>
                          </div>
                        ) : (
                          <span className="font-bold">No location data</span>
                        )}
                      </div>

                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {car.make} {car.model}
                          </p>
                          <p className="text-sm text-slate-500">
                            VIN: {car.vin}
                          </p>
                          <p className="text-sm text-slate-500">
                            Status: {car.status}
                          </p>
                        </div>

                        <div className="text-right text-sm text-slate-500">
                          <p>
                            Alerts:{" "}
                            <span className="font-medium text-slate-900">
                              {carAlerts.length}
                            </span>
                          </p>
                          <p>
                            Devices:{" "}
                            <span className="font-medium text-slate-900">
                              {carDevices.length}
                            </span>
                          </p>
                          {lastAlert && (
                            <p>
                              Last alert:{" "}
                              <span className="font-medium">
                                {lastAlert.type
                                  ? capitalize(String(lastAlert.type))
                                  : "Unknown"}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </OwnerLayout>
  );
}
