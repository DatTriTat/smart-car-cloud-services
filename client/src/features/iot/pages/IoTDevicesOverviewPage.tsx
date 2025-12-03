import Error from "@/components/shared/Error";
import Loading from "@/components/shared/Loading";
import type { Car } from "@/domain/types";
import { IoTLayout } from "../components/IoTLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIotDashboard } from "../hooks/useIotDashboard";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";

export function IoTDevicesOverviewPage() {
  const { data, isLoading, error } = useIotDashboard();
  const navigate = useNavigate();
  const [expandedCarIds, setExpandedCarIds] = useState<Set<string>>(
    () => new Set()
  );

  if (isLoading) return <Loading />;

  if (error || !data) return <Error error={error} />;

  const { cars, devices, alerts } = data;

  function getCarDeviceMetrics(car: Car) {
    const carDevices = devices.filter((d) => d.carId === car.id);
    const online = carDevices.filter((d) => d.status === "ONLINE").length;
    const offline = carDevices.filter((d) => d.status === "OFFLINE").length;
    const carAlerts = alerts.filter((a) => a.carId === car.id);
    const critical = carAlerts.filter((a) => a.severity === "CRITICAL").length;

    return {
      devices: carDevices,
      online,
      offline,
      totalAlerts: carAlerts.length,
      criticalAlerts: critical,
    };
  }

  const totalDevices = devices.length;
  const totalCars = cars.length;

  function toggleCar(carId: string) {
    setExpandedCarIds((prev) => {
      const next = new Set(prev);
      if (next.has(carId)) next.delete(carId);
      else next.add(carId);
      return next;
    });
  }

  return (
    <IoTLayout>
      <div className="space-y-6">
        {/* Top stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="uppercase">Cars</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{totalCars}</p>
              <p className="text-sm text-slate-500">
                Connected autonomous cars
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="uppercase">IoT Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{totalDevices}</p>
              <p className="text-sm text-slate-500">
                Audio / Camera / Edge Devices
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="uppercase">
                Critical alerts (system)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-rose-600">
                {alerts.filter((a) => a.severity === "CRITICAL").length}
              </p>
              <p className="text-sm text-slate-500">
                Across all cars and devices
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Per-car devices table */}
        <Card>
          <CardHeader>
            <CardTitle>Devices by Car</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Card</TableHead>
                  <TableHead className="text-right">Devices</TableHead>
                  <TableHead className="text-right">Online</TableHead>
                  <TableHead className="text-right">Offline</TableHead>
                  <TableHead className="text-right">Alerts</TableHead>
                  <TableHead className="text-right">Critical</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cars.map((car) => {
                  const {
                    devices: carDevices,
                    online,
                    offline,
                    totalAlerts,
                    criticalAlerts,
                  } = getCarDeviceMetrics(car);
                  const carAlerts = alerts.filter((a) => a.carId === car.id);
                  const isExpanded = expandedCarIds.has(car.id);

                  return (
                    <>
                      <TableRow key={car.id}>
                        <TableCell>
                          <div className="flex items-start gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={() => toggleCar(car.id)}
                            >
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>
                            <div className="flex flex-col">
                              <button
                                onClick={() =>
                                  navigate("/iot/car-devices", {
                                    state: { carId: car.id },
                                  })
                                }
                                className="font-medium text-slate-900 text-left hover:underline"
                              >
                                {car.make} {car.model}
                              </button>
                              <span className="text-sm text-slate-500">
                                VIN: {car.vin}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {carDevices.length}
                        </TableCell>
                        <TableCell className="text-right">{online}</TableCell>
                        <TableCell className="text-right">{offline}</TableCell>
                        <TableCell className="text-right">
                          {totalAlerts}
                        </TableCell>
                        <TableCell className="text-right text-rose-600">
                          {criticalAlerts}
                        </TableCell>
                      </TableRow>
                      {isExpanded && (
                        <TableRow>
                          <TableCell colSpan={6} className="bg-slate-50">
                            {carAlerts.length === 0 ? (
                              <div className="text-sm text-slate-500">
                                No alerts for this car.
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <div className="flex text-xs font-semibold text-slate-500 border-b border-slate-200 pb-1">
                                  <span className="w-1/4">Type</span>
                                  <span className="w-1/2">Message</span>
                                  <span className="w-1/4 text-right">
                                    Time
                                  </span>
                                  <span className="w-1/6 text-right">
                                    Severity
                                  </span>
                                </div>
                                {carAlerts.map((alert) => (
                                  <div
                                    key={alert.id}
                                    className="flex text-sm border-b border-slate-200 pb-1 last:border-none"
                                  >
                                    <span className="w-1/4 text-slate-700">
                                      {alert.alertType || alert.type}
                                    </span>
                                    <span className="w-1/2 text-slate-600">
                                      {alert.description}
                                    </span>
                                    <span className="w-1/4 text-right text-slate-500">
                                      {new Date(alert.createdAt).toLocaleString()}
                                    </span>
                                    <span className="w-1/6 text-right text-slate-700">
                                      {alert.severity}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </IoTLayout>
  );
}
