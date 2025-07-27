
import { getPageContent } from "@/lib/data";
import { notFound } from "next/navigation";
import { ContentForm } from "../content-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function EditPageContentPage({ params }: { params: { page: string } }) {
  const pageContent = await getPageContent(params.page);

  if (!pageContent || pageContent.length === 0) {
    notFound();
  }
  
  const pageTitle = params.page.charAt(0).toUpperCase() + params.page.slice(1);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
       <Button asChild variant="outline" className="mb-4">
            <Link href="/admin/pages">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Pages
            </Link>
        </Button>
      <h2 className="text-3xl font-bold tracking-tight">Edit Page: <span className="text-primary">{pageTitle}</span></h2>
      <p className="text-muted-foreground">
        Modify the fields below to update the content on the live site. Click "Save Changes" when you're done.
      </p>
      <ContentForm pageName={params.page} sections={pageContent} />
    </div>
  );
}
