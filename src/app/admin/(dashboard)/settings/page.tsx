
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
      <Card>
        <CardHeader>
          <CardTitle>Store Settings</CardTitle>
          <CardDescription>Manage general store settings and contact information.</CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm initialData={settings} />
        </CardContent>
      </Card>
    </div>
  );
}
