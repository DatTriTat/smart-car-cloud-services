import Loading from "@/components/shared/Loading";
import { useOwnerDashboard } from "../hooks/useOwnerDashboard";
import Error from "@/components/shared/Error";
import { OwnerLayout } from "../components/OwnerLayout";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export function OwnerAccountPage() {
  const ownerId = "u-owner-1";
  const { data, isLoading, error } = useOwnerDashboard(ownerId);

  if (isLoading) return <Loading />;

  if (error || !data) return <Error error={error} />;

  const { owner, subscription } = data;

  return (
    <OwnerLayout>
      {() => (
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-slate-700">
            <div>
              <p className="text-slate-500">Name</p>
              <p className="font-medium">{owner.name}</p>
            </div>
            <div>
              <p className="text-slate-500">Email</p>
              <p className="font-medium">{owner.email}</p>
            </div>
            <div>
              <p className="text-slate-500">Current plan</p>
              <p className="font-medium">{subscription.planName}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </OwnerLayout>
  );
}
