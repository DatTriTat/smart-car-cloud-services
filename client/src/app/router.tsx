import { createBrowserRouter } from "react-router";
import App from "@/App";
import { OwnerDashboardPage } from "@/features/owner/pages/OwnerDashboardPage";
import { OwnerOverviewPage } from "@/features/owner/pages/OwnerOverviewPage";
import { OwnerAccountPage } from "@/features/owner/pages/OwnerAccountPage";
import { IoTDevicesOverviewPage } from "@/features/iot/pages/IoTDevicesOverviewPage";
import { IoTCarDevicesPage } from "@/features/iot/pages/IoTCarDevicesPage";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RequireAuth } from "@/auth/RequireAuth";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/owner/dashboard",
    element: (
      <RequireAuth>
        <OwnerDashboardPage />
      </RequireAuth>
    ),
  },
  {
    path: "/owner/overview",
    element: (
      <RequireAuth>
        <OwnerOverviewPage />
      </RequireAuth>
    ),
  },
  {
    path: "/owner/account",
    element: (
      <RequireAuth>
        <OwnerAccountPage />
      </RequireAuth>
    ),
  },
  {
    path: "/iot/devices",
    element: (
      <RequireAuth>
        <IoTDevicesOverviewPage />
      </RequireAuth>
    ),
  },
  {
    path: "/iot/car-devices",
    element: (
      <RequireAuth>
        <IoTCarDevicesPage />
      </RequireAuth>
    ),
  },
]);
