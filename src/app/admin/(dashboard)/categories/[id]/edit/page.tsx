
import { getCategoryById } from "@/lib/data";
import { notFound } from "next/navigation";
import { CategoryForm } from "@/app/admin/(dashboard)/categories/category-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const category = await getCategoryById(params.id);

  if (!category) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Category</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryForm initialData={category} />
        </CardContent>
      </Card>
    </div>
  );
}
