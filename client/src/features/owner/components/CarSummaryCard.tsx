import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Car } from "@/domain/types";

interface CarSummaryCardProps {
  car: Car;
  totalAlerts: number;
  criticalAlerts: number;
}

const statusColorMap: Record<Car["status"], string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700 border-emerald-200",
  INACTIVE: "bg-slate-100 text-slate-700 border-slate-200",
  MAINTENANCE: "bg-amber-100 text-amber-700 border-amber-200",
};

export function CarSummaryCard({
  car,
  totalAlerts,
  criticalAlerts,
}: CarSummaryCardProps) {
  return (
    <Card className="mb-6 shadow-sm border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="text-xl font-semibold text-slate-900">
            {car.make} {car.model}
          </CardTitle>
          <p className="text-sm text-slate-500">VIN: {car.vin}</p>
          <p className="text-sm text-slate-500">Year: {car.year}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            className={`border text-xs font-medium px-2.5 py-0.5 rounded-full ${
              statusColorMap[car.status]
            }`}
          >
            {car.status}
          </Badge>
        </div>
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
