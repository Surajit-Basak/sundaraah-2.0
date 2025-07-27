
"use client";

import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { createOrder } from "@/lib/data";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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
        items: cartItems.map(item => ({ product_id: item.id, quantity: item.quantity, price: item.price })),
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
      <div className="grid md:grid-cols-2 gap-12">
        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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
              <div className="flex justify-between font-bold text-lg">
                <p>Total</p>
                <p>{formatPrice(cartTotal)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Customer Information */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={handlePlaceOrder} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" type="text" placeholder="Your full name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    Place Order
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
