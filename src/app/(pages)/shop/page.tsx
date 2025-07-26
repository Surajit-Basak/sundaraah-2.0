
"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/product-card";
import { getProducts } from "@/lib/data";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShopPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const products = await getProducts();
      setAllProducts(products);
      const productCategories = [...new Set(products.map(p => p.category))];
      setCategories(productCategories);
      const maxProductPrice = Math.ceil(Math.max(...products.map(p => p.price), 0));
      setMaxPrice(maxProductPrice);
      setPriceRange([0, maxProductPrice]);
      setIsLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredProducts = allProducts.filter(product => 
    product.price >= priceRange[0] && product.price <= priceRange[1]
  );

  return (
    <div className="bg-background">
      {/* Header Section */}
      <section className="bg-secondary py-16 md:py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Our Collection</h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Discover pieces designed to be cherished, each with its own story.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 p-6 rounded-lg bg-secondary">
                <h2 className="font-headline text-2xl font-bold text-primary mb-6">Filter by</h2>
                <div className="space-y-8">
                  <div>
                    <h3 className="font-headline text-lg font-semibold text-primary mb-4">Category</h3>
                    <ul className="space-y-2">
                      {categories.map(category => (
                          <li key={category}>
                              <a href="#" className="text-muted-foreground hover:text-primary">{category}</a>
                          </li>
                      ))}
                    </ul>
                  </div>
                   <div>
                    <h3 className="font-headline text-lg font-semibold text-primary mb-4">Price</h3>
                    <Slider
                      min={0}
                      max={maxPrice}
                      step={5}
                      value={[priceRange[1]]}
                      onValueChange={(value) => setPriceRange([0, value[0]])}
                      disabled={isLoading}
                    />
                    <div className="flex justify-between text-muted-foreground text-sm mt-2">
                      <span>{formatPrice(0)}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <main className="lg:col-span-3">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-4">
                      <Skeleton className="h-64 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}
