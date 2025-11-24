import type { ReactNode } from "react";
import { useState } from "react";
import { mockOwnerDashboardData } from "@/mocks/ownerDashboard";

interface OwnerLayoutProps {
  children: (selectedCarId: string) => ReactNode;
}

export function OwnerLayout({ children }: OwnerLayoutProps) {
  const { owner, cars } = mockOwnerDashboardData;
  const [selectedCarId, setSelectedCarId] = useState(cars[0]?.id);

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4 flex flex-col">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Smart Car Cloud</h2>
          <p className="text-xs text-slate-500">Signed in as {owner.name}</p>
        </div>

        <div className="mt-4">
          <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2">
            My Cars
          </h3>
          <div className="space-y-1">
            {cars.map((car) => (
              <button
                key={car.id}
                className={`w-full text-left px-3 py-2 rounded text-sm ${
                  car.id === selectedCarId
                    ? "bg-slate-900 text-white"
                    : "hover:bg-slate-100 hover:cursor-pointer text-slate-700"
                }`}
                onClick={() => setSelectedCarId(car.id)}
              >
                {car.make} {car.model}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main>{selectedCarId && children(selectedCarId)}</main>
    </div>
  );
}
