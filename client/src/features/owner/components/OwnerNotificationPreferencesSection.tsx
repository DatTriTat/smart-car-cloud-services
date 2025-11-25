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
} from "@/domain/types";

interface OwnerNotificationPreferencesSectionProps {
  preferences: NotificationPreference[];
  onToggleChannel: (channel: NotificationChannelKey, enabled: boolean) => void;
}

export function OwnerNotificationPreferencesSection({
  preferences,
  onToggleChannel,
}: OwnerNotificationPreferencesSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Choose how you want to receive alerts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {preferences.length === 0 ? (
          <div className="text-sm text-slate-500">
            No notification channels configured.
          </div>
        ) : (
          <div className="space-y-3">
            {preferences.map((pref) => (
              <div
                key={pref.channel}
                className="flex items-center justify-between gap-4 border border-slate-100 rounded-md px-3 py-2.5 bg-slate-50/60"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {pref.label}
                  </p>
                  <p className="text-xs text-slate-500">{pref.description}</p>
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
