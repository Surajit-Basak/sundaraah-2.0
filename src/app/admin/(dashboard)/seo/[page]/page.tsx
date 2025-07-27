
import { getPageSeo } from "@/lib/data";
import { notFound } from "next/navigation";
import { SeoForm } from "./seo-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function EditSeoPage({ params }: { params: { page: string } }) {
  const pageSeo = await getPageSeo(params.page);

  if (!pageSeo) {
    notFound();
  }
  
  const pageTitle = params.page.charAt(0).toUpperCase() + params.page.slice(1);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
       <Button asChild variant="outline" className="mb-4">
            <Link href="/admin/seo">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to SEO Pages
            </Link>
        </Button>
      <h2 className="text-3xl font-bold tracking-tight">Edit SEO: <span className="text-primary">{pageTitle}</span></h2>
      <p className="text-muted-foreground max-w-2xl">
        Modify the fields below to improve how this page appears on search engines like Google. A good title and description can increase clicks.
      </p>
      <SeoForm pageData={pageSeo} />
    </div>
  );
}
