import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { OwnerSubscription } from "@/domain/types";

interface OwnerPlanCardProps {
  subscription: OwnerSubscription;
  onUpgrade?: () => void;
}

export function OwnerPlanCard({ subscription, onUpgrade }: OwnerPlanCardProps) {
  const { planName, pricePerMonth, renewalDate } = subscription;
  const formattedRenewal = new Date(renewalDate).toLocaleDateString();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan & Billing</CardTitle>
        <CardDescription>
          Manage your smart surveillance subscription.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 text-slate-700">
        <div>
          <p className="text-slate-500">Current plan</p>
          <p className="font-medium">{planName}</p>
        </div>
        <div>
          <p className="text-slate-500">Price</p>
          <p className="font-medium">{pricePerMonth.toFixed(2)}/month</p>
        </div>
        <div>
          <p className="text-slate-500">Renews on</p>
          <p className="font-medium">{formattedRenewal}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="ml-auto" onClick={onUpgrade}>
          Upgrade plan
        </Button>
      </CardFooter>
    </Card>
  );
}
