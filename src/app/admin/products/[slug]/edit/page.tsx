
import { getProductBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import { ProductForm } from "@/app/admin/products/product-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm initialData={product} />
        </CardContent>
      </Card>
    </div>
  );
}
