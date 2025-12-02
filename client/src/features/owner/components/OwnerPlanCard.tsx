import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { OwnerSubscription } from "@/domain/types";
import { formatDate } from "@/utils";

interface OwnerPlanCardProps {
  subscription: OwnerSubscription;
  onUpgrade?: () => void;
}

export function OwnerPlanCard({ subscription, onUpgrade }: OwnerPlanCardProps) {
  const { planName, pricePerMonth, renewalDate } = subscription;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan & Billing</CardTitle>
        <CardDescription>
          Manage your smart surveillance subscription.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Current plan</p>
          <p className="font-medium">{planName}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Price</p>
          <p className="font-medium">{pricePerMonth.toFixed(2)}/month</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Renews on</p>
          <p className="font-medium">{formatDate(renewalDate)}</p>
        </div>
      </CardContent>
      <Separator />
      <CardFooter>
        <Button className="ml-auto" onClick={onUpgrade}>
          Upgrade plan
        </Button>
      </CardFooter>
    </Card>
  );
}
