import type { ReactNode } from "react";
import { Link, useLocation } from "react-router";

interface IoTLayoutProps {
  children: ReactNode;
}

export function IoTLayout({ children }: IoTLayoutProps) {
  const location = useLocation();

  const navItems = [
    { label: "Devices Overview", path: "/iot/devices" },
    { label: "Car Devices", path: "/iot/car-devices" },
  ];

  return (
    <div className="min-h-screen flex bg-slate-100">
      <aside className="w-64 bg-white border-r p-4 flex flex-col">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Iot Device Console</h2>
          <p className="text-sm text-slate-500">Edge / IoT team workspace</p>
        </div>

        <nav className="space-y-1 mb-6">
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

      {/* Main content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
