
import { getBannerById } from "@/lib/data";
import { notFound } from "next/navigation";
import { BannerForm } from "@/app/admin/(dashboard)/banners/banner-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditBannerPage({ params }: { params: { id: string } }) {
  const banner = await getBannerById(params.id);

  if (!banner) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Banner</CardTitle>
        </CardHeader>
        <CardContent>
          <BannerForm initialData={banner} />
        </CardContent>
      </Card>
    </div>
  );
}
