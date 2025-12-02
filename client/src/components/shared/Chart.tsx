import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { Alert } from "@/domain/types";
import { capitalize, getChartDatas } from "@/utils";

// export interface Alert {
//   id: string;
//   carId: string;
//   deviceId?: string;
//   type: string;
//   severity: AlertSeverity;
//   status: AlertStatus;
//   message: string;
//   confidenceScore: number;
//   createdAt: string;
//   acknowledgedAt?: string;
// }

// const chartData = [
//   { month: "January", desktop: 186, mobile: 80, ipad: 15 },
//   { month: "February", desktop: 305, mobile: 200, ipad: 15 },
//   { month: "March", desktop: 237, mobile: 120, ipad: 15 },
//   { month: "April", desktop: 73, mobile: 190, ipad: 85 },
//   { month: "May", desktop: 209, mobile: 130, ipad: 15 },
//   { month: "June", desktop: 214, mobile: 140, ipad: 15 },
// ];
// const chartConfig = {
//   desktop: {
//     label: "Desktop",
//     color: "#2563eb",
//   },
//   mobile: {
//     label: "Mobile",
//     color: "#60a5fa",
//   },
//   ipad: {
//     label: "Ipad",
//     color: "#fcba03",
//   },
// } satisfies ChartConfig;

// const chartData = [
//   { month: "february", desktop: 305, fill: "var(--color-february)" },
//   { month: "march", desktop: 237, fill: "var(--color-march)" },
//   { month: "april", desktop: 73, fill: "var(--color-april)" },
//   { month: "may", desktop: 209, fill: "var(--color-may)" },
//   { month: "june", desktop: 214, fill: "var(--color-june)" },
// ];

interface AlertPieChartProps {
  alerts: Alert[];
}

export function AlertPieChart({ alerts }: AlertPieChartProps) {
  const { chartData, chartConfig } = getChartDatas(alerts);

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <PieChart accessibilityLayer data={chartData}>
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Pie data={chartData} label dataKey="quantity" nameKey="type" />
      </PieChart>
    </ChartContainer>
  );
}

// <CartesianGrid vertical={false} />
//         <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
//<Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
//<Bar dataKey="ipad" fill="var(--color-ipad)" radius={4} />
//         <XAxis
//           dataKey="month"
//           tickLine={false}
//           tickMargin={10}
//           axisLine={false}
//           tickFormatter={(value) => value.slice(0, 3)}
//         />
