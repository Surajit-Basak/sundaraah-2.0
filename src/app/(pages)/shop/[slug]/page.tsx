
"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import { getProductBySlug, getProducts } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Check, ShoppingCart, Loader2 } from "lucide-react";
import RecommendationSection from "@/components/recommendation-section";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

type ProductPageProps = {
  params: {
    slug: string;
  };
};

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { addItem, isAdding } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      const fetchedProduct = await getProductBySlug(params.slug);
      if (!fetchedProduct) {
        notFound();
      }
      setProduct(fetchedProduct);
      setIsLoading(false);
    };
    fetchProduct();
  }, [params.slug]);


  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, 1);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  if (isLoading || !product) {
    return (
        <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        </div>
    )
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Image */}
          <div className="w-full h-96 md:h-auto">
            <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
                <Image
                src={product.imageUrl}
                alt={product.name}
                data-ai-hint="jewelry detail"
                fill
                className="object-cover"
                priority
                />
            </div>
          </div>

          {/* Product Details */}
          <div>
            <p className="text-accent font-semibold mb-2">{product.category}</p>
            <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4 text-primary">
              {product.name}
            </h1>
            <p className="text-2xl font-semibold text-primary mb-6">
              {formatPrice(product.price)}
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              {product.description}
            </p>

            <div className="space-y-4 mb-8">
              <h3 className="font-headline text-xl font-bold text-primary">Details</h3>
              <ul className="space-y-2">
                {product.details.map((detail, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-accent" />
                    <span className="text-muted-foreground">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button size="lg" className="w-full md:w-auto bg-primary hover:bg-primary/90" onClick={handleAddToCart} disabled={isAdding}>
              {isAdding ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                  <ShoppingCart className="mr-2 h-5 w-5" />
              )}
              Add to Cart
            </Button>
          </div>
        </div>

        <RecommendationSection product={product} />
      </div>
    </div>
  );
}

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
