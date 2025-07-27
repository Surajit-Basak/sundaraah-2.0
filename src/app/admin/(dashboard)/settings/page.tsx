
import { getSettings } from "@/lib/data";
import { SettingsForm } from "./settings-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata = {
    title: "Settings | Sundaraah Admin",
};

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Store Settings</h2>
        </div>
        <p className="text-muted-foreground">
            Manage your site's identity, theme colors, and other global settings.
        </p>
        <SettingsForm initialData={settings} />
    </div>
  );
}
