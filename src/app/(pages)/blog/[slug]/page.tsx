import { notFound } from "next/navigation";
import Image from "next/image";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/data";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type BlogPostPageProps = {
  params: {
    slug: string;
  };
};

// Generate metadata for the page
export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = getBlogPostBySlug(params.slug);
  if (!post) {
    return {
      title: "Post Not Found",
    };
  }
  return {
    title: `${post.title} | Sundaraah Showcase`,
    description: post.excerpt,
  };
}

// Statically generate routes for each blog post
export async function generateStaticParams() {
    const posts = getBlogPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <article>
          <div className="mb-8 text-center">
            <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4 text-primary">
              {post.title}
            </h1>
            <p className="text-muted-foreground">{post.date}</p>
          </div>

          <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={post.imageUrl}
              alt={post.title}
              data-ai-hint="jewelry blog"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div
            className="prose prose-lg lg:prose-xl max-w-none mx-auto text-foreground"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        
          <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
              </Link>
            </Button>
          </div>
        </article>
      </div>
    </div>
  );
}
