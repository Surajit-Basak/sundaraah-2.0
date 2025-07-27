
import { CollectionForm } from "@/app/admin/(dashboard)/collections/collection-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewCollectionPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Collection</CardTitle>
        </CardHeader>
        <CardContent>
          <CollectionForm />
        </CardContent>
      </Card>
    </div>
  );
}
