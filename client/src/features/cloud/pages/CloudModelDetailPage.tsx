import Error from "@/components/shared/Error";
import Loading from "@/components/shared/Loading";
import type { AiModel, AlertTypeDef } from "@/domain/types";
import { useOwnerDashboard } from "@/features/owner/hooks/useOwnerDashboard";
import { Link, useNavigate, useParams } from "react-router";
import { CloudLayout } from "../components/CloudLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeftFromLine } from "lucide-react";
import { formatDate } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CloudModelDetailPage() {
  const { modelId } = useParams<{ modelId: string }>();
  const navigate = useNavigate();
  const ownerId = "";

  const { data, isLoading, error } = useOwnerDashboard(ownerId);

  console.log("hello");

  if (isLoading) return <Loading />;

  if (error || !data) return <Error error={error} />;

  const model = data.aiModels.find((m: AiModel) => m.id === modelId) as
    | AiModel
    | undefined;

  if (!model) {
    return (
      <CloudLayout>
        <div className="flex flex-col justify-center items-center min-h-screen">
          <Button onClick={() => navigate(-1)}>
            <ArrowLeftFromLine />
            Back to models
          </Button>
          <div className="mt-2 text-slate-500">Model not found.</div>
        </div>
      </CloudLayout>
    );
  }

  const alertTypes = data.alertTypes as AlertTypeDef[];

  return (
    <CloudLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-lg font-medium">
              <Link to="/cloud/models" className="hover:text-slate-600">
                AI Models
              </Link>{" "}
              / <span>Model Details</span>
            </div>
            <h1 className="text-lg font-semibold">{model.name}</h1>
            <p className="text-sm text-slate-500">{model.type}</p>
          </div>
          <div>
            <div className="uppercase tracking-wide text-slate-500">STATUS</div>
            <div
              className={
                model.status === "RUNNING"
                  ? "text-emerald-600 font-semibold"
                  : model.status === "TRAINING"
                  ? "text-amber-600 font-semibold"
                  : "text-slate-500 font-semibold"
              }
            >
              {model.status}
            </div>
            <div className="mt-1 text-slate-500">
              Last Updated: {formatDate(model.updatedAt)}
            </div>
          </div>
        </div>

        {/* Basic info */}
        <Card>
          <CardHeader>
            <CardTitle>Model metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-slate-700">
              <div>
                <span className="uppercase text-slate-500">Name</span>
                <div>{model.name}</div>
              </div>
              <div>
                <span className="uppercase text-slate-500">Type</span>
                <div>{model.type}</div>
              </div>
              <div>
                <span className="uppercase text-slate-500">Version</span>
                <div>{model.version}</div>
              </div>
              <div>
                <span className="uppercase text-slate-500">Status</span>
                <div>{model.status}</div>
              </div>
              <div>
                <span className="uppercase text-slate-500">Last updated</span>
                <div>{formatDate(model.updatedAt)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* For your teammates: pretend this is the ML interface */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="font-semibold text-slate-900">
              Planned ML interface (design-level)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-slate-700">
            <p className="text-slate-500">
              This section is for your design document. It does not have to be
              fully functional, but describes how the ML module would be used.
            </p>

            <div>
              <span className="text-sm uppercase text-slate-400">
                Example inference API (conceptual)
              </span>
              <pre className="mt-1 bg-slate-950 text-slate-100 rounded-md p-3 overflow-x-auto">
                {`POST /ml/predict
Content-Type: application/json

{
  "modelId": "${model.id}",
  "carId": "CAR001",
  "audioClipId": "clip-123",
  "timestamp": "2025-11-23T10:15:00Z"
}

// Response (example)
{
  "alerts": [
    {
      "typeKey": "engine_knock",
      "severity": "WARN",
      "score": 0.92
    }
  ]
}`}
              </pre>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm uppercase text-slate-400">
                Related alert types (for design)
              </span>
              <p className="text-sm text-slate-500 mb-1">
                For now, this lists all alert types. Later, you can extend the
                model type to link specific alert types.
              </p>
              <div className="flex flex-wrap gap-2">
                {alertTypes.map((t) => (
                  <span
                    key={t.id}
                    className="px-2 py-1 rounded-full border border-slate-200 text-sm bg-amber-100"
                  >
                    {t.name} <span className="text-slate-400">({t.key})</span>
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CloudLayout>
  );
}
