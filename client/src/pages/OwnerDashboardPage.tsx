import { mockOwnerDashboardData } from "../mocks/ownerDashboard";

export function OwnerDashboardPage() {
  const { owner, cars, alerts, devices } = mockOwnerDashboardData;

  return (
    <div>
      <h1>Welcome, {owner.name}</h1>
      <h2>
        {cars[0].make} {cars[0].model}
      </h2>
    </div>
  );
}
