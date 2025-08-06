
"use client";

import { useWishlist } from "@/context/wishlist-context";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product-card";
import { Heart, Loader2 } from "lucide-react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
    const { wishlist, isLoading } = useWishlist();
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
        const supabase = createSupabaseBrowserClient();
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login?redirect=/wishlist');
            }
        };
        checkUser();
    }, [router]);

    if (!isClient || isLoading) {
        return (
            <div className="container mx-auto px-4 py-16 md:py-24 text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Loading your wishlist...</p>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto px-4 py-16 md:py-24">
            <h1 className="font-headline text-4xl font-bold text-primary mb-12 text-center">My Wishlist</h1>
            {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {wishlist.map(item => (
                        <ProductCard key={item.id} product={item.product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 px-6 bg-secondary rounded-lg">
                    <Heart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-bold text-primary mb-2">Your Wishlist is Empty</h2>
                    <p className="text-muted-foreground mb-6">Looks like you haven't added anything yet. Explore our collection and find something you love!</p>
                    <Button asChild>
                        <Link href="/shop">Start Shopping</Link>
                    </Button>
                </div>
            )}
        </div>
    )
}
