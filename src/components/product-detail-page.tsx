
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Check, ShoppingCart, Loader2, Heart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import RelatedProducts from "./related-products";
import RecentlyViewedProducts from "./recently-viewed-products";
import ProductReviews from "./product-reviews";
import { cn } from "@/lib/utils";

type ProductDetailPageClientProps = {
  product: Product;
};

export default function ProductDetailPageClient({ product }: ProductDetailPageClientProps) {
  const { addItem, isAdding } = useCart();
  const { wishlist, toggleWishlist, isUpdatingWishlist } = useWishlist();
  const { toast } = useToast();
  
  // Initialize selectedImage with the main product imageUrl.
  const [selectedImage, setSelectedImage] = useState(product?.imageUrl);

  // When the product data changes, update the selected image to the main one.
  useEffect(() => {
    if (product) {
      setSelectedImage(product.imageUrl);
    }
  }, [product]);

  useEffect(() => {
    const storeRecentlyViewed = (productId: string) => {
      let viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      // Remove the product if it's already there to move it to the front
      viewed = viewed.filter((id: string) => id !== productId);
      // Add the new product to the front
      viewed.unshift(productId);
      // Keep only the last 5 viewed products
      const recentlyViewed = viewed.slice(0, 5);
      localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    };

    if (product) {
      storeRecentlyViewed(product.id);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, 1);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  if (!product) {
    return null; // Or a loading/error state
  }
  
  // Create a combined list of images, ensuring the main imageUrl is first and there are no duplicates.
  const allImages = [product.imageUrl, ...product.imageUrls.filter(url => url !== product.imageUrl)];
  const isInWishlist = wishlist.some(item => item.product_id === product.id);

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Image Gallery */}
          <div className="flex flex-col gap-4">
             <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={selectedImage}
                  alt={product.name}
                  data-ai-hint="jewelry detail"
                  fill
                  className="object-cover transition-all duration-300"
                  priority
                  key={selectedImage} // Force re-render on image change for transition
                />
            </div>
            {allImages.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                    {allImages.map((imgUrl, index) => (
                        <button 
                            key={index} 
                            className={cn(
                                "relative aspect-square rounded-md overflow-hidden transition-all",
                                selectedImage === imgUrl ? "ring-2 ring-primary ring-offset-2" : "opacity-70 hover:opacity-100"
                            )}
                            onClick={() => setSelectedImage(imgUrl)}
                        >
                            <Image
                                src={imgUrl}
                                alt={`${product.name} thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
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
            <div className="flex items-center gap-4">
              <Button size="lg" className="w-full md:w-auto bg-primary hover:bg-primary/90" onClick={handleAddToCart} disabled={isAdding}>
                {isAdding ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                    <ShoppingCart className="mr-2 h-5 w-5" />
                )}
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" onClick={() => toggleWishlist(product.id)} disabled={isUpdatingWishlist}>
                 <Heart className={cn("mr-2 h-5 w-5", isInWishlist && "fill-destructive text-destructive")} />
                 {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
              </Button>
            </div>
          </div>
        </div>

        <ProductReviews productId={product.id} reviews={product.reviews} />
        <RelatedProducts categoryId={product.category_id} currentProductId={product.id} />
        <RecentlyViewedProducts currentProductId={product.id} />

      </div>
    </div>
  );
}
