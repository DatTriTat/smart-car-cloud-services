import { createBrowserRouter } from "react-router";
import App from "@/App";
import { OwnerDashboardPage } from "@/features/owner/pages/OwnerDashboardPage";
import { OwnerOverviewPage } from "@/features/owner/pages/OwnerOverviewPage";

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
]);
