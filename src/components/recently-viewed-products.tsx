
'use client';

import { useState, useEffect } from "react";
import { getProductsByIds } from "@/lib/data";
import type { Product } from "@/types";
import ProductCard from "./product-card";

type RecentlyViewedProductsProps = {
    currentProductId: string;
}

export default function RecentlyViewedProducts({ currentProductId }: RecentlyViewedProductsProps) {
    const [viewedProducts, setViewedProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchViewedProducts = async () => {
            setIsLoading(true);
            const viewedIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
            const filteredIds = viewedIds.filter((id: string) => id !== currentProductId);

            if (filteredIds.length > 0) {
                const products = await getProductsByIds(filteredIds);
                setViewedProducts(products);
            }
            setIsLoading(false);
        };

        fetchViewedProducts();
    }, [currentProductId]);

    if (isLoading || viewedProducts.length === 0) {
        return null;
    }

    return (
        <div className="mt-16 md:mt-24">
            <h2 className="font-headline text-3xl font-bold text-center mb-12 text-primary">
                Recently Viewed
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {viewedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
