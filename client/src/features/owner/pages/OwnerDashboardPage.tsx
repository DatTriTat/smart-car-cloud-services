import { mockOwnerDashboardData } from "@/mocks/ownerDashboard";

export function OwnerDashboardPage() {
  const { owner, cars, alerts, devices } = mockOwnerDashboardData;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Welcome, {owner.name}</h1>

      <p className="text-slate-600 mb-4">
        You have {cars.length} connected car(s).
      </p>

      <pre className="bg-slate-100 p-4 rounded text-sm border">
        {JSON.stringify({ owner, cars, alerts, devices }, null, 2)}
      </pre>
    </div>
  );
}
