import type { ChartConfig } from "@/components/ui/chart";
import type { Alert } from "@/domain/types";

export function capitalize(alertType: string) {
  const words = alertType.toLowerCase().split("_");
  const result = [];
  for (const word of words) {
    result.push(word[0].toUpperCase() + word.slice(1));
  }
  return result.join(" ");
}

export function formatDate(iso: string) {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getAlertTypeChartDatas(alerts: Alert[]) {
  const alertTypes = new Set(alerts.map((alert) => alert.type));
  const chartData = [...alertTypes].map((alertType) => {
    return {
      type: alertType,
      quantity: alerts.filter((alert) => alert.type === alertType).length,
      fill: `var(--color-${alertType})`,
    };
  });

  const chartConfig = Object.fromEntries(
    [...alertTypes].map((alertType, idx) => [
      alertType,
      {
        label: capitalize(alertType),
        color: `var(--chart-${idx + 1})`,
      },
    ])
  ) satisfies ChartConfig;

  return {
    chartData,
    chartConfig,
  };
}

export function getAlertSeverityChartDatas(alerts: Alert[]) {
  const alertSeverities = new Set(alerts.map((alert) => alert.severity));
  const chartData = [...alertSeverities].map((severity) => {
    return {
      severity: severity,
      quantity: alerts.filter((alert) => alert.severity === severity).length,
      fill: `var(--color-${severity})`,
    };
  });

  const chartConfig = Object.fromEntries(
    [...alertSeverities].map((severity, idx) => [
      severity,
      {
        label: capitalize(severity),
        color: `var(--chart-${idx + 1})`,
      },
    ])
  ) satisfies ChartConfig;

  return {
    chartData,
    chartConfig,
  };
}

export function formatPrettyDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short", // Dec
    day: "numeric", // 15
    year: "numeric", // 2025
  }).format(date);
}

export function getLastNDaysRangeLabel(n: number): string {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - (n - 1));
  return `${formatPrettyDate(start)} - ${formatPrettyDate(end)}`;
}

export function filterAlertsByDays(alerts: Alert[], days: number): Alert[] {
  const now = Date.now();
  const msInDay = 24 * 60 * 60 * 1000;
  const cutoff = now - days * msInDay;

  return alerts.filter((alert) => {
    const createdTime = new Date(alert.createdAt).getTime();
    return createdTime >= cutoff;
  });
}
