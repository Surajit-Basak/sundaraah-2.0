
import { getBlogPostBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import { BlogPostForm } from "@/app/admin/(dashboard)/blog/blog-post-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditBlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Blog Post</CardTitle>
        </CardHeader>
        <CardContent>
          <BlogPostForm initialData={post} />
        </CardContent>
      </Card>
    </div>
  );
}
