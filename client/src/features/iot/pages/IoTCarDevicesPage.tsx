import Error from "@/components/shared/Error";
import Loading from "@/components/shared/Loading";
import { type Car, type IoTDevice } from "@/domain/types";
import { useIotDashboard } from "../hooks/useIotDashboard";
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
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddDeviceDialog } from "../components/AddDeviceDialog";
import { EditDeviceDialog } from "../components/EditDeviceDialog";
import { DeleteDeviceDialog } from "../components/DeleteDeviceDialog";
import {
  createIotDevice,
  deleteIotDevice,
  updateIotDevice,
} from "../api/iotDevicesApi";
import {
  addDevice,
  updateDevice,
  deleteDevice,
} from "../api/iotDashboardMutations";
import type { IotDashboardData } from "../api/iotDashboardApi";
import { useLocation } from "react-router";

export function IoTCarDevicesPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useIotDashboard();
  const location = useLocation();

  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<IoTDevice | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingDevice, setDeletingDevice] = useState<IoTDevice | null>(null);
  const [carSearch, setCarSearch] = useState("");
  const [showCarList, setShowCarList] = useState(false);

  useEffect(() => {
    if (selectedCarId) return;
    if (!data || data.cars.length === 0) return;

    const preferred = (location.state as { carId?: string } | null)?.carId;
    if (preferred && data.cars.some((c) => c.id === preferred)) {
      setSelectedCarId(preferred);
    } else {
      setSelectedCarId(data.cars[0].id);
    }
  }, [data, selectedCarId, location.state]);

  async function handleAddDevice(deviceWithoutId: Omit<IoTDevice, "id">) {
    try {
      const created = await createIotDevice(deviceWithoutId);
      queryClient.setQueryData<IotDashboardData | undefined>(
        ["iotDashboard"],
        (oldData) => (oldData ? addDevice(oldData, created) : oldData)
      );
    } catch (err) {
      console.error("Failed to create device", err);
    }
  }

  async function handleSaveEditedDevice(update: IoTDevice) {
    try {
      const updated = await updateIotDevice(update.id, update);
      queryClient.setQueryData<IotDashboardData | undefined>(
        ["iotDashboard"],
        (oldData) => (oldData ? updateDevice(oldData, updated) : oldData)
      );
    } catch (err) {
      console.error("Failed to update device", err);
    }
  }

  async function handleDeleteDevice(deviceId: string) {
    try {
      const deletedId = await deleteIotDevice(deviceId);
      queryClient.setQueryData<IotDashboardData | undefined>(
        ["iotDashboard"],
        (oldData) => (oldData ? deleteDevice(oldData, deletedId) : oldData)
      );
    } catch (err) {
      console.error("Failed to delete device", err);
    }
  }

  if (isLoading) return <Loading />;

  if (error || !data || !selectedCarId) return <Error error={error} />;

  const { cars } = data;

  const selectedCar: Car | undefined = cars.find((c) => c.id === selectedCarId);

  const carDevices = data.devices.filter((d) => d.carId === selectedCarId);
  const filteredCars = cars.filter((car) => {
    const term = carSearch.trim().toLowerCase();
    if (!term) return true;
    return (
      car.make.toLowerCase().includes(term) ||
      car.model.toLowerCase().includes(term) ||
      car.vin.toLowerCase().includes(term)
    );
  });

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

          <div className="flex flex-col gap-2 w-full max-w-md relative">
            <label className="text-sm text-slate-600">Current Car</label>
            <Input
              placeholder="Search by make, model, or VIN"
              value={carSearch}
              onFocus={() => setShowCarList(true)}
              onChange={(e) => {
                setCarSearch(e.target.value);
                setShowCarList(true);
              }}
            />

            {showCarList && (
              <div className="absolute top-full mt-1 w-full max-h-48 overflow-y-auto rounded-md border border-slate-300 bg-white shadow-lg z-10">
                {filteredCars.map((car) => {
                  const isActive = car.id === selectedCarId;
                  return (
                    <button
                      key={car.id}
                      onClick={() => {
                        setSelectedCarId(car.id);
                        setShowCarList(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-100 ${
                        isActive ? "bg-slate-900 text-white" : "text-slate-700"
                      }`}
                    >
                      <div className="font-medium">
                        {car.make} {car.model}
                      </div>
                      <div className="text-xs opacity-80">{car.vin}</div>
                    </button>
                  );
                })}
                {filteredCars.length === 0 && (
                  <div className="px-3 py-2 text-sm text-slate-500">
                    No matching cars
                  </div>
                )}
              </div>
            )}
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
