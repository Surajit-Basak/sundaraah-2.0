
"use client";

import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { createOrder } from "@/lib/data";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Loader2, Lock } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const fetchUser = async () => {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
    };
    fetchUser();
  }, []);

  const handlePlaceOrder = async (formData: FormData) => {
    setIsLoading(true);
    const customerName = formData.get("name") as string;
    const customerEmail = formData.get("email") as string;

    if (!customerName || !customerEmail || cartItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields and make sure your cart is not empty.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const orderId = await createOrder({
        customer_name: customerName,
        customer_email: customerEmail,
        total: cartTotal,
        items: cartItems, // Pass the full cart item
        user_id: user?.id,
      });
      
      clearCart();
      
      router.push(`/checkout/success?orderId=${orderId}`);

    } catch (error) {
      console.error("Failed to create order:", error);
      toast({
        variant: "destructive",
        title: "Order Failed",
        description: "There was a problem placing your order. Please try again.",
      });
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0 && !isLoading) {
    return (
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
            <h1 className="font-headline text-3xl font-bold text-primary mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">You can't checkout with an empty cart. Go find something beautiful!</p>
            <Button asChild>
                <a href="/shop">Continue Shopping</a>
            </Button>
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <h1 className="font-headline text-4xl md:text-5xl font-bold text-center mb-12 text-primary">
        Checkout
      </h1>
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Left Side: Forms */}
        <div className="space-y-8">
            <form action={handlePlaceOrder} id="checkout-form" className="space-y-8">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" type="text" placeholder="Your full name" defaultValue={user?.user_metadata?.full_name || ''} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" name="email" type="email" placeholder="you@example.com" defaultValue={user?.email || ''} required />
                    </div>
                </CardContent>
              </Card>

              {/* Payment Details (Simulated) */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                  <CardDescription>
                    This is a demo. Do not enter real card details.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input id="card-number" placeholder="1234 5678 9101 1121" disabled />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="expiry">Expiry</Label>
                            <Input id="expiry" placeholder="MM/YY" disabled />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cvc">CVC</Label>
                            <Input id="cvc" placeholder="123" disabled />
                        </div>
                    </div>
                     <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                        <Lock className="w-3 h-3"/>
                        <span>Payment is secure and encrypted. For a real app, this would use a provider like Stripe.</span>
                    </div>
                </CardContent>
              </Card>
            </form>
        </div>
        
        {/* Right Side: Order Summary */}
        <div className="sticky top-24">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Image src={item.imageUrl} alt={item.name} width={60} height={60} className="rounded-md" />
                        <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                    </div>
                    <p>{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <hr className="my-6" />
              <div className="flex justify-between font-bold text-lg mb-6">
                <p>Total</p>
                <p>{formatPrice(cartTotal)}</p>
              </div>
              <Button form="checkout-form" type="submit" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Lock className="mr-2 h-5 w-5" />}
                    {isLoading ? "Processing..." : "Confirm and Pay"}
                </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
