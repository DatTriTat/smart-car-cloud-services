import Error from "@/components/shared/Error";
import Loading from "@/components/shared/Loading";
import type { AlertTypeDef } from "@/domain/types";
import { useOwnerDashboard } from "@/features/owner/hooks/useOwnerDashboard";
import { CloudLayout } from "../components/CloudLayout";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableRow,
  TableBody,
  TableHead,
  TableHeader,
  TableCell,
} from "@/components/ui/table";
import { capitalize } from "@/utils";
import { AlertSeverityBadge } from "@/components/status/AlertSeverityBadge";

export function CloudAlertTypesPage() {
  const onwerId = "u-owner-1";
  const { data, isLoading, error } = useOwnerDashboard(onwerId);

  if (isLoading) return <Loading />;

  if (error || !data) return <Error error={error} />;

  const alertTypes = data.alertTypes as AlertTypeDef[];

  return (
    <CloudLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold">Alert Types</h1>
            <p className="text-sm text-slate-500">
              Configure predefined audio-based alert types used across cars, IoT
              devices, and AI models.
            </p>
          </div>
          <div className="flex flex-col items-end text-sm text-slate-600">
            <span className="uppercase tracking-wide text-slate-400">
              TOTAL TYPES
            </span>
            <span className="font-medium">{alertTypes.length}</span>
          </div>
        </div>

        {/* Models table */}
        <Card>
          <CardHeader>
            <CardTitle>Predefined alert types</CardTitle>
          </CardHeader>
          <CardContent>
            {alertTypes.length === 0 ? (
              <div className="text-slate-500">
                No alert types configured yet.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Default severity</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Enabled</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alertTypes.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{t.name}</TableCell>
                      <TableCell>{capitalize(t.category)}</TableCell>
                      <TableCell>
                        <AlertSeverityBadge severity={t.defaultSeverity} />
                      </TableCell>
                      <TableCell>{t.description}</TableCell>
                      <TableCell>
                        {t.enabled ? (
                          <span className="text-emerald-600 font-medium">
                            Enabled
                          </span>
                        ) : (
                          <span className="text-slate-500 font-medium">
                            Disabled
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </CloudLayout>
  );
}
