
"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from 'next/navigation';
import ProductCard from "@/components/product-card";
import { getProducts, getCategories } from "@/lib/data";
import { Slider } from "@/components/ui/slider";
import { formatPrice } from "@/lib/utils";
import type { Product, Category } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ShopPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<string>("newest");
  
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [products, fetchedCategories] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      
      const publishedProducts = products.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setAllProducts(publishedProducts);
      setCategories([{ id: 'all', name: 'All' }, ...fetchedCategories]);

      const maxProductPrice = Math.ceil(Math.max(...products.map(p => p.price), 0));
      setMaxPrice(maxProductPrice > 0 ? maxProductPrice : 1000);
      setPriceRange([0, maxProductPrice > 0 ? maxProductPrice : 1000]);
      
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let products = allProducts.filter(product => {
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesSearch = searchQuery 
        ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      return matchesCategory && matchesPrice && matchesSearch;
    });

    switch(sortBy) {
        case 'price-asc':
            products.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            products.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
        default:
             // Already sorted by newest by default on fetch
            break;
    }

    return products;

  }, [allProducts, selectedCategory, priceRange, searchQuery, sortBy]);

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
                <h2 className="font-headline text-2xl font-bold text-primary mb-6">Filter & Sort</h2>
                <div className="space-y-8">
                  <div>
                    <h3 className="font-headline text-lg font-semibold text-primary mb-4">Category</h3>
                    <ul className="space-y-2">
                      {categories.map(category => (
                          <li key={category.id}>
                              <button 
                                onClick={() => setSelectedCategory(category.name)}
                                className={cn(
                                  "text-muted-foreground hover:text-primary w-full text-left",
                                  selectedCategory === category.name && "text-primary font-bold"
                                )}
                              >
                                {category.name}
                              </button>
                          </li>
                      ))}
                    </ul>
                  </div>
                   <div>
                    <h3 className="font-headline text-lg font-semibold text-primary mb-4">Price Range</h3>
                    <Slider
                      min={0}
                      max={maxPrice}
                      step={5}
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      disabled={isLoading}
                    />
                    <div className="flex justify-between text-muted-foreground text-sm mt-2">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                  </div>
                   <div>
                    <h3 className="font-headline text-lg font-semibold text-primary mb-4">Sort By</h3>
                     <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="price-asc">Price: Low to High</SelectItem>
                            <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        </SelectContent>
                    </Select>
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
                <>
                  <div className="mb-4">
                     {searchQuery && (
                      <h2 className="text-xl mb-2">
                        Search results for: <span className="font-bold text-primary">"{searchQuery}"</span>
                      </h2>
                    )}
                    <p className="text-sm text-muted-foreground">Showing {filteredAndSortedProducts.length} of {allProducts.length} products</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredAndSortedProducts.length > 0 ? filteredAndSortedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    )) : (
                        <p className="md:col-span-3 text-center text-muted-foreground">
                            No products match your criteria.
                        </p>
                    )}
                  </div>
                </>
              )}
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}
