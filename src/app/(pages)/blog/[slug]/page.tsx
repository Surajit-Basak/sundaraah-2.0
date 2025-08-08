import { notFound } from "next/navigation";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/data";
import Image from "next/image";
import type { BlogPost } from "@/types";
import { marked } from "marked";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/config";


// This function generates the pages for each blog post at build time
export async function generateStaticParams() {
  // Create a temporary, build-time-only Supabase client
  // This is necessary because generateStaticParams runs at build time,
  // where there are no cookies. The regular server client would fail.
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data: posts, error } = await supabase.from('blog_posts').select('slug');

  if (error || !posts) {
    console.error('Error fetching slugs for generateStaticParams:', error);
    return [];
  }

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// This function generates the metadata for each blog post page
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug);
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

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post: BlogPost | null = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const parsedContent = await marked.parse(post.content);

  return (
    <article className="bg-background">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8 md:mb-12">
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">
              {post.title}
            </h1>
            <p className="text-muted-foreground text-lg">
              Published on {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </header>

          {/* Featured Image */}
          <div className="relative h-64 md:h-96 w-full mb-8 md:mb-12 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={post.imageUrl}
              alt={post.title}
              data-ai-hint="blog post image"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Post Content */}
          <div
            className="prose lg:prose-xl max-w-none text-foreground"
            dangerouslySetInnerHTML={{ __html: parsedContent }}
          />
        </div>
      </div>
    </article>
  );
}
