import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { capitalize } from "@/utils";

export type AlertSeverityFilter = "ALL" | "INFO" | "WARN" | "CRITICAL";

interface AlertsFilterBarProps {
  severity: AlertSeverityFilter;
  onChangeSeverity: (value: AlertSeverityFilter) => void;
  searchQuery: string;
  onChangeSearch: (value: string) => void;
  totalCount: number;
  filteredCount: number;
}

const severityOptions: AlertSeverityFilter[] = [
  "ALL",
  "INFO",
  "WARN",
  "CRITICAL",
];

export function AlertsFilterBar({
  severity,
  onChangeSeverity,
  searchQuery,
  onChangeSearch,
  totalCount,
  filteredCount,
}: AlertsFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
      {/* Left: severity buttons */}
      <div className="inline-flex rounded-md border border-slate-200 bg-white overflow-hidden">
        {severityOptions.map((option) => {
          const isActive = severity === option;

          return (
            <Button
              key={option}
              variant={isActive ? "default" : "ghost"}
              className={
                isActive
                  ? "px-6 rounded-none"
                  : "px-6 rounded-none text-slate-700 hover:bg-slate-50"
              }
              onClick={() => onChangeSeverity(option)}
            >
              {capitalize(option)}
            </Button>
          );
        })}
      </div>

      {/* Right: search + count */}
      <div className="flex items-center gap-3">
        <div className="text-sm text-slate-500 hidden md:block">
          Showing {filteredCount} of {totalCount} alerts
        </div>
        <Input
          value={searchQuery}
          onChange={(e) => onChangeSearch(e.target.value)}
          placeholder="Search alerts..."
          className="h-8 w-60 border-slate-400"
        />
      </div>
    </div>
  );
}
