
import { getPageContent, getPageSeo } from "@/lib/data";

export async function generateMetadata() {
  const seoData = await getPageSeo("returns");
  return {
    title: seoData?.seo_title || "Return Policy | Sundaraah Showcase",
    description: seoData?.meta_description || "Read our policy on returns, exchanges, and refunds.",
  };
}

export default async function ReturnPolicyPage() {
  const content = await getPageContent("returns");
  const pageData = content.find(s => s.section === 'content')?.content;

  if (!pageData) {
    return (
        <div className="container mx-auto px-4 py-16 md:py-24">
            <h1 className="font-headline text-4xl font-bold text-primary mb-8">Return & Refund Policy</h1>
            <p>Content not available. Please check back later.</p>
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="prose lg:prose-xl max-w-4xl mx-auto">
            <h1 className="font-headline text-4xl font-bold text-primary mb-2">{pageData.title}</h1>
            <p className="text-sm text-muted-foreground">Last updated: {pageData.last_updated}</p>
            <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
        </div>
    </div>
  );
}
