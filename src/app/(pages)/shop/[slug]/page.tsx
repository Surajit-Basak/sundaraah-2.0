
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/data";
import ProductDetailPageClient from "@/components/product-detail-page";
import type { Product } from "@/types";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/config";

type ProductPageProps = {
  params: {
    slug: string;
  };
};

// Statically generate routes for each product
export async function generateStaticParams() {
    // Create a temporary, build-time-only Supabase client
    // This is necessary because generateStaticParams runs at build time,
    // where there are no cookies. The regular server client would fail.
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    const { data: products, error } = await supabase.from('products').select('slug');

    if (error || !products) {
      console.error('Error fetching slugs for generateStaticParams:', error);
      return [];
    }

    return products.map((product) => ({
        slug: product.slug,
    }));
}

// Generate metadata for the page
export async function generateMetadata({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return {
      title: "Product Not Found",
    };
  }
  return {
    title: `${product.name} | Sundaraah Showcase`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product: Product | null = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailPageClient product={product} />;
}
