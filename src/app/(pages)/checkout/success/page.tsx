
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    return (
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
            <div className="flex justify-center mb-6">
                <CheckCircle className="w-24 h-24 text-green-500" />
            </div>
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">
                Thank You For Your Order!
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Your order has been placed successfully. A confirmation email has been sent to you.
            </p>
            {orderId && (
                <p className="text-muted-foreground mb-8">
                    Your Order ID is: <span className="font-semibold text-primary">{orderId.substring(0,8).toUpperCase()}</span>
                </p>
            )}
            <div className="flex justify-center gap-4">
                <Button asChild>
                    <Link href="/shop">Continue Shopping</Link>
                </Button>
                 <Button asChild variant="outline">
                    <Link href="/">Back to Home</Link>
                </Button>
            </div>
        </div>
    );
}
