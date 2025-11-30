import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import type {
  NotificationPreference,
  NotificationChannelKey,
  PlanId,
} from "@/domain/types";

interface OwnerNotificationPreferencesSectionProps {
  planId: PlanId;
  preferences: NotificationPreference[] | null | undefined;
  onToggleChannel: (channel: NotificationChannelKey, enabled: boolean) => void;
}

export function OwnerNotificationPreferencesSection({
  planId,
  preferences,
  onToggleChannel,
}: OwnerNotificationPreferencesSectionProps) {
  const safePreferences = Array.isArray(preferences) ? preferences : [];

  const filteredPreferences = safePreferences.filter((pref) => {
    if (planId === "PREMIUM") return true;

    if (planId === "STANDARD") {
      return pref.channel === "EMAIL" || pref.channel === "PUSH";
    }

    return pref.channel === "EMAIL";
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Choose how you want to receive alerts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {safePreferences.length === 0 ? (
          <div className=" text-slate-500">
            No notification channels configured.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPreferences.map((pref) => (
              <div
                key={pref.channel}
                className="flex items-center justify-between gap-4 border border-slate-100 rounded-md px-3 py-2.5 bg-slate-50/60"
              >
                <div>
                  <p className="font-medium text-slate-900">{pref.label}</p>
                  <p className="text-sm text-slate-500">{pref.description}</p>
                </div>
                <Switch
                  checked={pref.enabled}
                  onCheckedChange={(checked) =>
                    onToggleChannel(pref.channel, checked)
                  }
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
