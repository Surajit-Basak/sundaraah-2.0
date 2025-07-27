
import BlogPostCard from "@/components/blog-post-card";
import { getBlogPosts, getPageContent } from "@/lib/data";
import type { BlogPost, PageContent } from "@/types";

export async function generateMetadata() {
  const content = await getPageContent("blog");
  const headerContent = content.find(s => s.section === 'header')?.content;
  return {
    title: `${headerContent?.title || "Blog"} | Sundaraah Showcase`,
    description: headerContent?.subtitle || "Read our stories, tips, and insights on handcrafted jewelry and art.",
  };
}

const getContent = (sections: PageContent[], sectionName: string) => {
  return sections.find(s => s.section === sectionName)?.content || {};
};

export default async function BlogPage() {
  const [posts, pageContent] = await Promise.all([
    getBlogPosts(),
    getPageContent("blog"),
  ]);

  const headerContent = getContent(pageContent, 'header');

  return (
    <div className="bg-background">
      {/* Header Section */}
      <section className="bg-secondary py-16 md:py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">{headerContent.title || "Our Journal"}</h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            {headerContent.subtitle || "Stories, inspiration, and insights from the world of Sundaraah."}
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
