import { createBrowserRouter } from "react-router";
import App from "@/App";
import { OwnerDashboardPage } from "@/features/owner/pages/OwnerDashboardPage";
import { OwnerOverviewPage } from "@/features/owner/pages/OwnerOverviewPage";
import { OwnerAccountPage } from "@/features/owner/pages/OwnerAccountPage";
import { IoTDevicesOverviewPage } from "@/features/iot/pages/IoTDevicesOverviewPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/owner/dashboard",
    element: <OwnerDashboardPage />,
  },
  {
    path: "/owner/overview",
    element: <OwnerOverviewPage />,
  },
  {
    path: "/owner/account",
    element: <OwnerAccountPage />,
  },
  {
    path: "/iot/devices",
    element: <IoTDevicesOverviewPage />,
  },
]);
