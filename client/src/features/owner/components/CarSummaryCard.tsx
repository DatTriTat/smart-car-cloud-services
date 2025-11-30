import { CarStatusBadge } from "@/components/status/CarStatusBadge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Car } from "@/domain/types";

interface CarSummaryCardProps {
  car: Car;
  totalAlerts: number;
  criticalAlerts: number;
}

export function CarSummaryCard({
  car,
  totalAlerts,
  criticalAlerts,
}: CarSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="text-xl">
            {car.make} {car.model}
          </div>
          <CarStatusBadge status={car.status} />
        </CardTitle>
        <CardDescription>
          <p>VIN: {car.vin}</p>
          <p>Year: {car.year}</p>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row gap-6 text-sm text-slate-700">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
            Total alerts (last 24h)
          </p>
          <p className="text-lg font-semibold">{totalAlerts}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
            Critical alerts
          </p>
          <p className="text-lg font-semibold text-rose-600">
            {criticalAlerts}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
