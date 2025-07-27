
import { BannerForm } from "@/app/admin/banners/banner-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewBannerPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Banner</CardTitle>
        </CardHeader>
        <CardContent>
          <BannerForm />
        </CardContent>
      </Card>
    </div>
  );
}
