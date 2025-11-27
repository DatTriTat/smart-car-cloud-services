import Error from "@/components/shared/Error";
import Loading from "@/components/shared/Loading";
import type { AiModel } from "@/domain/types";
import { useOwnerDashboard } from "@/features/owner/hooks/useOwnerDashboard";
import { CloudLayout } from "../components/CloudLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/utils";

export function CloudModelsPage() {
  const ownerId = "u-owner-1";
  const { data, isLoading, error } = useOwnerDashboard(ownerId);

  if (isLoading) return <Loading />;

  if (error || !data) return <Error error={error} />;

  const models = data.aiModels as AiModel[];

  return (
    <CloudLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold">AI models</h1>
            <p className="text-sm text-slate-500">
              Manage audio intelligence models deployed to the smart car cloud.
            </p>
          </div>
          <div className="flex flex-col items-end text-sm text-slate-600">
            <span className="uppercase tracking-wide text-slate-400">
              TOTAL MODELS
            </span>
            <span className="font-medium">{models.length}</span>
          </div>
        </div>

        {/* Models table */}
        <Card>
          <CardHeader>
            <CardTitle>Deployed AI Models</CardTitle>
          </CardHeader>
          <CardContent>
            {models.length === 0 ? (
              <div className="text-slate-500">No AI models configured yet.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {models.map((model) => (
                    <TableRow key={model.id}>
                      <TableCell>{model.name}</TableCell>
                      <TableCell>{model.type}</TableCell>
                      <TableCell>{model.version}</TableCell>
                      <TableCell
                        className={
                          model.status === "RUNNING"
                            ? "text-emerald-600 font-medium"
                            : model.status === "TRAINING"
                            ? "text-amber-600 font-medium"
                            : "text-slate-500 font-medium"
                        }
                      >
                        {model.status}
                      </TableCell>
                      <TableCell>{formatDate(model.updatedAt)}</TableCell>
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
