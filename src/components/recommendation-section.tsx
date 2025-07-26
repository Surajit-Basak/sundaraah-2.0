"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import {
  getProductRecommendations,
  type ProductRecommendationOutput,
} from "@/ai/flows/product-recommendation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

type RecommendationSectionProps = {
  product: Product;
};

export default function RecommendationSection({ product }: RecommendationSectionProps) {
  const [recommendations, setRecommendations] = useState<ProductRecommendationOutput["recommendations"] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    setRecommendations(null);
    try {
      const result = await getProductRecommendations({
        productDescription: product.description,
        productCategory: product.category,
        productImageUrl: product.imageUrl,
      });
      setRecommendations(result.recommendations);
    } catch (error) {
      console.error("Failed to get recommendations:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch AI recommendations. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-12 md:mt-16">
      <div className="text-center">
         <Button onClick={handleGetRecommendations} disabled={isLoading} size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Sparkles className="mr-2 h-5 w-5" />
          {isLoading ? "Finding Similar Items..." : "Find Complementary Items"}
        </Button>
      </div>

      {isLoading && (
         <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
             <Card key={i}>
                <CardHeader>
                    <Skeleton className="h-32 w-full" />
                </CardHeader>
                <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardContent>
             </Card>
          ))}
         </div>
      )}

      {recommendations && recommendations.length > 0 && (
        <div className="mt-8">
            <h3 className="font-headline text-2xl font-bold mb-6 text-center text-primary">You Might Also Like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((rec, index) => (
                    <Card key={index} className="overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                        <Link href="#">
                            <Image
                                src={rec.imageUrl || 'https://placehold.co/400x400.png'}
                                alt={rec.name}
                                data-ai-hint="jewelry recommendation"
                                width={400}
                                height={400}
                                className="w-full h-48 object-cover"
                            />
                        </Link>
                        <CardHeader>
                            <CardTitle className="font-headline text-lg">{rec.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{rec.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      )}
    </div>
  );
}
