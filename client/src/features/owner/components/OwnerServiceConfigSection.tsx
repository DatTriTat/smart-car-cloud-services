import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import type { CarServiceConfig, IntelligenceServiceKey } from "@/domain/types";

interface OwnerServiceConfigSectionProps {
  carId: string;
  configs: CarServiceConfig[];
  onToggleService: (
    carId: string,
    key: IntelligenceServiceKey,
    enabled: boolean
  ) => void;
}

export function OwnerServiceConfigSection({
  carId,
  configs,
  onToggleService,
}: OwnerServiceConfigSectionProps) {
  const configForCar = configs.find((config) => config.carId === carId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Intelligence Services</CardTitle>
        <CardDescription>
          Enable or disable audio intelligence services for this vehicle.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!configForCar || configForCar.services.length === 0 ? (
          <div className="text-slate-500">
            No intelligence services configured for this car.
          </div>
        ) : (
          <div className="space-y-4">
            {configForCar.services.map((service) => (
              <div
                key={service.key}
                className="flex items-center justify-between gap-4 border border-slate-100 rounded-md px-3 py-2.5 bg-slate-50/60"
              >
                <div>
                  <p className="font-medium text-slate-900">{service.label}</p>
                  <p className="text-sm text-slate-500">
                    {service.description}
                  </p>
                </div>
                <Switch
                  checked={service.enabled}
                  onCheckedChange={(checked) =>
                    onToggleService(carId, service.key, checked)
                  }
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
