import type { PlanId } from "@/domain/types";

export interface PlanOption {
  id: PlanId;
  name: string;
  pricePerMonth: number;
  description: string;
  features: string[];
}

export const OWNER_PLANS: PlanOption[] = [
  {
    id: "BASIC",
    name: "Basic",
    pricePerMonth: 0,
    description: "Essential monitoring for a single smart car.",
    features: ["1 car included", "Basic alert history", "Email notifications"],
  },
  {
    id: "STANDARD",
    name: "Standard",
    pricePerMonth: 9.99,
    description: "Enhanced safety features for daily driving.",
    features: [
      "Up to 2 cars",
      "Extended alert history",
      "Email + in-app notifications",
      "Engine anomaly detection",
    ],
  },
  {
    id: "PREMIUM",
    name: "Premium",
    pricePerMonth: 19.99,
    description: "Full intelligence suite for all your vehicles.",
    features: [
      "Up to 5 cars",
      "Full alert history",
      "Email + SMS + in-app notifications",
      "Advanced audio models",
    ],
  },
];
