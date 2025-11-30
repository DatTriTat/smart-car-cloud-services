import { useAuth } from "@/auth/AuthContext";
import { Separator } from "@/components/ui/separator";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router";

interface CloudLayoutProps {
  children: ReactNode;
}

export function CloudLayout({ children }: CloudLayoutProps) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { label: "Overview", path: "/cloud/overview" },
    { label: "Alerts", path: "/cloud/alerts" },
    { label: "Alert Types", path: "/cloud/alert-types" },
    { label: "AI models", path: "/cloud/models" },
    { label: "Database", path: "/cloud/database" }, // future
  ];

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4 flex flex-col">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Cloud Ops Console</h2>
          <p className="text-sm text-slate-500">
            Signed in as {user?.name || "Cloud service staff"}
          </p>
          {user && (
            <button
              className="mt-2 text-slate-600 font-medium underline hover:cursor-pointer"
              onClick={logout}
            >
              Logout
            </button>
          )}
        </div>

        <Separator />

        {/* Top navigation */}
        <nav className="space-y-1 mb-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded text-sm transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-200"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
