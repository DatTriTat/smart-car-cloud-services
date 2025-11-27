import Error from "@/components/shared/Error";
import Loading from "@/components/shared/Loading";
import type { OwnerDashboardData, AiModel } from "@/domain/types";
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
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { saveOwnerDashboard } from "@/features/owner/api/ownerDashboardStorage";
import { Button } from "@/components/ui/button";
import { AddModelDialog } from "../components/AddModelDialog";
import { EditModelDialog } from "../components/EditModelDialog";
import { DeleteModelDialog } from "../components/DeleteModelDialog";

export function CloudModelsPage() {
  const ownerId = "u-owner-1";
  const { data, isLoading, error } = useOwnerDashboard(ownerId);
  const queryClient = useQueryClient();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<AiModel | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingModel, setDeletingModel] = useState<AiModel | null>(null);

  function handleAddModel(payload: {
    name: string;
    type: string;
    version: string;
    status: AiModel["status"];
  }) {
    const newModel: AiModel = {
      id: `model-${Date.now()}`,
      name: payload.name,
      type: payload.type,
      version: payload.version,
      status: payload.status,
      updatedAt: new Date().toISOString(),
    };

    queryClient.setQueryData<OwnerDashboardData | undefined>(
      ["ownerDashboard", ownerId],
      (oldData) => {
        if (!oldData) return oldData;
        const newData: OwnerDashboardData = {
          ...oldData,
          aiModels: [...oldData.aiModels, newModel],
        };
        saveOwnerDashboard(newData);
        return newData;
      }
    );
  }

  function handleSaveEditedModel(updated: AiModel) {
    queryClient.setQueryData<OwnerDashboardData | undefined>(
      ["ownerDashboard", ownerId],
      (oldData) => {
        if (!oldData) return oldData;

        const newModels = oldData.aiModels.map((model) =>
          model.id === updated.id ? updated : model
        );
        const newData: OwnerDashboardData = {
          ...oldData,
          aiModels: newModels,
        };

        saveOwnerDashboard(newData);
        return newData;
      }
    );
  }

  function handleDeleteModel(modelId: string) {
    queryClient.setQueryData<OwnerDashboardData | undefined>(
      ["ownerDashboard", ownerId],
      (oldData) => {
        if (!oldData) return oldData;

        const newModels = oldData.aiModels.filter(
          (model) => model.id !== modelId
        );

        const newData: OwnerDashboardData = {
          ...oldData,
          aiModels: newModels,
        };

        saveOwnerDashboard(newData);
        return newData;
      }
    );
  }

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
            <CardTitle className="flex items-center justify-between">
              <div>Deployed AI Models</div>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                Add Model
              </Button>
            </CardTitle>
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
                      <TableCell className="flex items-center gap-4 justify-end">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingModel(model);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => {
                            setDeletingModel(model);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <AddModelDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleAddModel}
      />

      <EditModelDialog
        open={isEditDialogOpen}
        model={editingModel}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleSaveEditedModel}
      />

      <DeleteModelDialog
        open={isDeleteDialogOpen}
        model={deletingModel}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteModel}
      />
    </CloudLayout>
  );
}
