
import { BlogPostForm } from "@/app/admin/(dashboard)/blog/blog-post-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewBlogPostPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Blog Post</CardTitle>
        </CardHeader>
        <CardContent>
          <BlogPostForm />
        </CardContent>
      </Card>
    </div>
  );
}
