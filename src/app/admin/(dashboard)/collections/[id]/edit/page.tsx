
import { getCollectionById } from "@/lib/data";
import { notFound } from "next/navigation";
import { CollectionForm } from "@/app/admin/(dashboard)/collections/collection-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditCollectionPage({ params }: { params: { id: string } }) {
  const collection = await getCollectionById(params.id);

  if (!collection) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Collection</CardTitle>
        </CardHeader>
        <CardContent>
          <CollectionForm initialData={collection} />
        </CardContent>
      </Card>
    </div>
  );
}
