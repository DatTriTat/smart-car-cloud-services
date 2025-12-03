import type { ChartConfig } from "@/components/ui/chart";
import type { Alert, AlertTypeDef } from "@/domain/types";

export function capitalize(alertType: string | undefined | null) {
  if (!alertType) return "";
  const safe = String(alertType);
  const words = safe.toLowerCase().split("_");
  const result = [];
  for (const word of words) {
    if (!word) continue;
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
  const normalized = alerts
    .map((alert) => alert.alertType)
    .filter(Boolean) as string[];

  const alertTypes = new Set(normalized);

  if (alertTypes.size === 0) {
    return { chartData: [], chartConfig: {} satisfies ChartConfig };
  }

  const chartData = [...alertTypes].map((alertType) => ({
    type: alertType,
    quantity: normalized.filter((t) => t === alertType).length,
    fill: `var(--color-${alertType})`,
  }));

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

export function getChartDatas(alerts: Alert[]) {
  const normalized = alerts
    .map((alert) => alert.alertType)
    .filter(Boolean) as string[];

  const alertTypes = new Set(normalized);

  const chartData = [...alertTypes].map((alertType) => {
    const count = normalized.filter((type) => type === alertType).length;
    return {
      type: alertType,
      quantity: count,
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

export function getAlertSeverityChartDatas(
  alerts: Alert[],
  alertTypes: AlertTypeDef[] = []
) {
  const severityPalette: Record<string, string> = {
    CRITICAL: "#ef4444", // red
    WARN: "#f59e0b", // amber
    INFO: "#3b82f6", // blue
  };

  const severityByType = new Map<string, string>();
  alertTypes.forEach((t, idx) => {
    if (!t.type || !t.defaultSeverity) return;
    severityByType.set(String(t.type).toLowerCase(), t.defaultSeverity);
    severityByType.set(
      String(t.type).toUpperCase(),
      t.defaultSeverity
    );
  });

  const severityCounts = new Map<string, number>();
  alerts.forEach((alert) => {
    const key = String(alert.alertType || alert.type || "").toLowerCase();
    const mappedSeverity = severityByType.get(key);
    const severity = mappedSeverity || alert.severity;
    if (!severity) return;
    severityCounts.set(severity, (severityCounts.get(severity) || 0) + 1);
  });

  const chartData = Array.from(severityCounts.entries()).map(
    ([severity, count], idx) => ({
      severity,
      quantity: count,
      fill:
        severityPalette[severity] || `var(--chart-${idx + 1})`,
    })
  );

  const chartConfig = Object.fromEntries(
    chartData.map((item, idx) => [
      item.severity,
      {
        label: capitalize(item.severity),
        color:
          severityPalette[item.severity] || `var(--chart-${idx + 1})`,
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
