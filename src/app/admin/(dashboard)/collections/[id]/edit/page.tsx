
import { getCollectionById, getProducts } from "@/lib/data";
import { notFound } from "next/navigation";
import { CollectionForm } from "@/app/admin/(dashboard)/collections/collection-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ManageProductsForm } from "@/app/admin/(dashboard)/collections/manage-products-form";
import { Separator } from "@/components/ui/separator";

export default async function EditCollectionPage({ params }: { params: { id: string } }) {
  const collection = await getCollectionById(params.id);

  if (!collection) {
    notFound();
  }

  const allProducts = await getProducts();
  const productIdsInCollection = collection.products?.map(p => p.id) || [];


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

      <Separator />

      <Card>
        <CardHeader>
            <CardTitle>Manage Products in Collection</CardTitle>
        </CardHeader>
        <CardContent>
            <ManageProductsForm
                collectionId={collection.id}
                allProducts={allProducts}
                productIdsInCollection={productIdsInCollection}
            />
        </CardContent>
      </Card>
    </div>
  );
}
