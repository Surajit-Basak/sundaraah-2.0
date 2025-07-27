

"use client";

import type { ProductReview } from "@/types";
import { Star, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { ProductReviewForm } from "./product-review-form";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

type ProductReviewsProps = {
  productId: string;
  reviews: ProductReview[];
};

const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;

  return (
    <div className="flex items-center gap-1 text-accent">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-5 h-5 fill-accent" />
      ))}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-5 h-5" />
      ))}
    </div>
  );
};


export default function ProductReviews({ productId, reviews }: ProductReviewsProps) {
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const fetchUser = async () => {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
    };
    fetchUser();
  }, []);

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
      star,
      count: reviews.filter(r => r.rating === star).length
  }));
  const totalReviews = reviews.length;

  return (
    <div className="mt-16 md:mt-24 border-t pt-12">
        <h2 className="font-headline text-3xl font-bold text-center mb-12 text-primary">
            Customer Reviews
        </h2>
        
        {totalReviews > 0 ? (
          <div className="grid md:grid-cols-12 gap-8 mb-12">
              <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-secondary rounded-lg">
                  <p className="text-5xl font-bold text-primary mb-2">{averageRating.toFixed(1)}</p>
                  <StarRating rating={averageRating} />
                  <p className="text-muted-foreground mt-2">Based on {totalReviews} reviews</p>
              </div>
              <div className="md:col-span-8 flex flex-col justify-center">
                  {ratingCounts.map(({star, count}) => (
                      <div key={star} className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground w-12">{star} star{star > 1 ? 's' : ''}</span>
                          <Progress value={(count / totalReviews) * 100} className="w-full h-2" />
                          <span className="text-sm font-medium w-8 text-right">{count}</span>
                      </div>
                  ))}
              </div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground mb-8">No reviews yet. Be the first to review this product!</p>
        )}

        <div className="space-y-8">
            {reviews.map(review => (
                <Card key={review.id}>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                           <Avatar>
                                <AvatarFallback>
                                    {review.author_name ? review.author_name.charAt(0) : <User />}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-lg">{review.title}</CardTitle>
                                <div className="flex items-center gap-2">
                                    <StarRating rating={review.rating} />
                                    <p className="font-bold text-sm">{review.author_name}</p>
                                    <p className="text-sm text-muted-foreground hidden sm:block">- {new Date(review.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    {review.comment && (
                         <CardContent>
                            <p className="text-muted-foreground italic">"{review.comment}"</p>
                        </CardContent>
                    )}
                </Card>
            ))}
        </div>
        
        {user && (
          <div className="mt-12">
            <ProductReviewForm 
              productId={productId} 
              userId={user.id} 
              authorName={user.user_metadata.full_name || "Anonymous"} 
            />
          </div>
        )}
    </div>
  );
}
