import Error from "@/components/shared/Error";
import Loading from "@/components/shared/Loading";
import {
  type OwnerDashboardData,
  type Car,
  type IoTDevice,
} from "@/domain/types";
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
import { EditDeviceDialog } from "../components/EditDeviceDialog";
import { DeleteDeviceDialog } from "../components/DeleteDeviceDialog";
import {
  addDevice,
  deleteDevice,
  updateDevice,
} from "@/features/owner/api/ownerDashboardMutations";

export function IoTCarDevicesPage() {
  const ownerId = "u-owner-1";
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useOwnerDashboard(ownerId);

  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [devicesState, setDevicesState] = useState<IoTDevice[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<IoTDevice | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingDevice, setDeletingDevice] = useState<IoTDevice | null>(null);

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

    queryClient.setQueryData<OwnerDashboardData | undefined>(
      ["ownerDashboard", ownerId],
      (oldData) => {
        if (!oldData) return oldData;
        const newData = addDevice(oldData, newDevice);
        saveOwnerDashboard(newData); // Simulate backend update here
        return newData;
      }
    );
  }

  function handleSaveEditedDevice(update: IoTDevice) {
    setDevicesState((prev) =>
      prev.map((d) => (d.id === update.id ? update : d))
    );

    queryClient.setQueryData<OwnerDashboardData | undefined>(
      ["ownerDashboard", ownerId],
      (oldData) => {
        if (!oldData) return oldData;
        const newData = updateDevice(oldData, update);
        saveOwnerDashboard(newData); // Simulate update backend here
        return newData;
      }
    );
  }

  function handleDeleteDevice(deviceId: string) {
    setDevicesState((prev) => prev.filter((d) => d.id !== deviceId));

    queryClient.setQueryData<OwnerDashboardData | undefined>(
      ["ownerDashboard", ownerId],
      (oldData) => {
        if (!oldData) return oldData;
        const newData = deleteDevice(oldData, deviceId);
        saveOwnerDashboard(newData);
        return newData;
      }
    );
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
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
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
                      <TableCell>
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
                      <TableCell>
                        <div className="flex justify-end gap-3">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setEditingDevice(device);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => {
                              setDeletingDevice(device);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            Remove
                          </Button>
                        </div>
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

        <EditDeviceDialog
          open={isEditDialogOpen}
          device={editingDevice}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={handleSaveEditedDevice}
        />

        <DeleteDeviceDialog
          open={isDeleteDialogOpen}
          device={deletingDevice}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteDevice}
        />
      </div>
    </IoTLayout>
  );
}
