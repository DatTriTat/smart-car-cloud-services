import Error from "@/components/shared/Error";
import Loading from "@/components/shared/Loading";
import type { Car, IoTDevice } from "@/domain/types";
import { useOwnerDashboard } from "@/features/owner/hooks/useOwnerDashboard";
import { useEffect, useState } from "react";
import { IoTLayout } from "../components/IoTLayout";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { AddDeviceDialog } from "../components/AddDeviceDialog";
import { saveOwnerDashboard } from "@/features/owner/api/ownerDashboardStorage";

export function IoTCarDevicesPage() {
  const ownerId = "u-owner-1";
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useOwnerDashboard(ownerId);

  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [devicesState, setDevicesState] = useState<IoTDevice[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    if (data) {
      setDevicesState(data.devices);
      if (!selectedCarId && data.cars.length > 0) {
        setSelectedCarId(data.cars[0].id);
      }
    }
  }, [data, selectedCarId]);

  function handleAddDevice(deviceWithoutId: Omit<IoTDevice, "id">) {
    const newDevice: IoTDevice = {
      id: `dev-${Date.now()}`,
      ...deviceWithoutId,
    };

    setDevicesState((prev) => [...prev, newDevice]);

    queryClient.setQueryData(["ownerDashboard", ownerId], (oldData: any) => {
      if (!oldData) return oldData;
      const newData = {
        ...oldData,
        devices: [...oldData.devices, newDevice],
      };

      saveOwnerDashboard(newData); // Simulate backend update here

      return newData;
    });
  }

  if (isLoading) return <Loading />;

  if (error || !data || !selectedCarId) return <Error error={error} />;

  const { cars } = data;

  const selectedCar: Car | undefined = cars.find((c) => c.id === selectedCarId);

  const carDevices = devicesState.filter((d) => d.carId === selectedCarId);

  return (
    <IoTLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              Car Devices
            </h1>
            <p className="text-sm text-slate-500">
              View and manage IoT devices for a specific car.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600">Current Car</label>
            <Select
              value={selectedCarId}
              onValueChange={(value) => setSelectedCarId(value)}
            >
              <SelectTrigger className="w-[300px] border border-slate-400 bg-white">
                <SelectValue placeholder="Select Your Vehicle" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Your Vehicle</SelectLabel>
                  {cars.map((car) => (
                    <SelectItem key={car.id} value={car.id}>
                      {car.make} {car.model} ({car.vin})
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Selected Car Summary */}
        {selectedCar && (
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedCar.make} {selectedCar.model}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-700 space-y-1">
              <p className="text-sm text-slate-500">VIN: {selectedCar.vin}</p>
              <p className="text-sm text-slate-500">
                Status: {selectedCar.status}
              </p>
              <p className="text-sm text-slate-500">
                Devices attached: {carDevices.length}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Devices table */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Devices for this car</CardTitle>
            <Button onClick={() => setIsAddDialogOpen(true)}>Add Device</Button>
          </CardHeader>
          <CardContent>
            {carDevices.length === 0 ? (
              <div className="text-slate-500">
                No IoT devices configured for this car.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {carDevices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell className="font-medium">
                        {device.deviceName}
                      </TableCell>
                      <TableCell className="text-slate-700">
                        {device.deviceType}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={
                            device.status === "ONLINE"
                              ? "text-emerald-600 text-sm font-medium"
                              : "text-slate-500 text-sm font-medium"
                          }
                        >
                          {device.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <AddDeviceDialog
          open={isAddDialogOpen}
          carId={selectedCarId}
          onClose={() => setIsAddDialogOpen(false)}
          onSave={handleAddDevice}
        />
      </div>
    </IoTLayout>
  );
}
