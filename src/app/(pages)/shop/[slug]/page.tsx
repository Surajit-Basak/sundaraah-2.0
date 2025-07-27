
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/data";
import ProductDetailPageClient from "@/components/product-detail-page";
import type { Product } from "@/types";

type ProductPageProps = {
  params: {
    slug: string;
  };
};

// Statically generate routes for each product
export async function generateStaticParams() {
    const products = await getProducts();
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
