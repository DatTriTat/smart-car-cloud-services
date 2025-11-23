import { createBrowserRouter } from "react-router";
import App from "@/App";
import { OwnerDashboardPage } from "@/features/owner/pages/OwnerDashboardPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/owner/dashboard",
    element: <OwnerDashboardPage />,
  },
]);
