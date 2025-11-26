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

  const { owner, subscription, cars, devices, alerts } = data;

  const totalCars = cars.length;
  const totalDevices = devices.length;
  const totalAlerts = alerts.length;
  const criticalAlerts = alerts.filter((a) => a.severity === "CRITICAL").length;

  return (
    <OwnerLayout>
      {() => (
        <div className="space-y-6">
          {/* Account info */}
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

          {/* Subscription + usage summary */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Subscription</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-slate-700">
                <div>
                  <p className="text-slate-500">Current Plan</p>
                  <p className="font-medium">{subscription.planName}</p>
                </div>

                <div>
                  <p className="text-slate-500">Price</p>
                  <p className="font-medium">
                    {subscription.pricePerMonth === 0
                      ? "Free"
                      : `$${subscription.pricePerMonth.toFixed(2)}/month`}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">Renews on</p>
                  <p className="font-medium">
                    {new Date(subscription.renewalDate).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cars</span>
                  <span className="font-medium text-slate-900">
                    {totalCars}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Devices</span>
                  <span className="font-medium text-slate-900">
                    {totalDevices}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Alerts</span>
                  <span className="font-medium text-slate-900">
                    {totalAlerts}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Critical Alerts</span>
                  <span className="font-medium text-rose-600">
                    {criticalAlerts}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </OwnerLayout>
  );
}
