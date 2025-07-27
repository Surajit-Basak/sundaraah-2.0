
import { getPageContent, getPageSeo } from "@/lib/data";

export async function generateMetadata() {
  const seoData = await getPageSeo("privacy");
  return {
    title: seoData?.seo_title || "Privacy Policy | Sundaraah Showcase",
    description: seoData?.meta_description || "Review our privacy policy to understand how we handle your data.",
  };
}

export default async function PrivacyPolicyPage() {
  const content = await getPageContent("privacy");
  const pageData = content.find(s => s.section === 'content')?.content;

  if (!pageData) {
    return (
        <div className="container mx-auto px-4 py-16 md:py-24">
            <h1 className="font-headline text-4xl font-bold text-primary mb-8">Privacy Policy</h1>
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
