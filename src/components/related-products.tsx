
'use client';

import { useState, useEffect } from "react";
import { getRelatedProducts } from "@/lib/data";
import type { Product } from "@/types";
import ProductCard from "./product-card";
import { Skeleton } from "./ui/skeleton";

type RelatedProductsProps = {
    categoryId: string;
    currentProductId: string;
};

export default function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            setIsLoading(true);
            const products = await getRelatedProducts(categoryId, currentProductId);
            setRelatedProducts(products);
            setIsLoading(false);
        };

        fetchRelatedProducts();
    }, [categoryId, currentProductId]);

    if (isLoading) {
        return (
            <div className="mt-16 md:mt-24">
                <h2 className="font-headline text-3xl font-bold text-center mb-12 text-primary">
                    You Might Also Like
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {[...Array(4)].map((_, i) => (
                         <div key={i} className="space-y-4">
                            <Skeleton className="h-64 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (relatedProducts.length === 0) {
        return null;
    }

    return (
        <div className="mt-16 md:mt-24">
            <h2 className="font-headline text-3xl font-bold text-center mb-12 text-primary">
                You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {relatedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
