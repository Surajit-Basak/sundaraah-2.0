
"use client";

import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { createOrder, createRazorpayOrder, getSettings, getUserProfile } from "@/lib/data";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Loader2, Lock } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import Script from "next/script";
import type { Settings, UserProfile } from "@/types";
import { Separator } from "@/components/ui/separator";

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const fetchUserAndSettings = async () => {
        const { data } = await supabase.auth.getUser();
        if (!data.user) {
          router.push('/login?redirect=/checkout');
          return;
        }
        setUser(data.user);
        const [appSettings, profile] = await Promise.all([
            getSettings(),
            getUserProfile(data.user.id)
        ]);
        setSettings(appSettings);
        setUserProfile(profile);
    };
    fetchUserAndSettings();
  }, [router]);

  const shippingFee = settings?.shipping_fee ?? 0;
  const freeShippingThreshold = settings?.free_shipping_threshold ?? Infinity;
  const isEligibleForFreeShipping = cartTotal >= freeShippingThreshold;
  const finalShippingCost = isEligibleForFreeShipping ? 0 : shippingFee;
  const orderTotal = cartTotal + finalShippingCost;


  const handlePlaceOrder = async () => {
    setIsLoading(true);

    if (!userProfile || !userProfile.full_name || !userProfile.email || cartItems.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please complete your profile and ensure your cart is not empty before checking out.",
      });
      setIsLoading(false);
      return;
    }

    try {
        const razorpayOrderData = await createRazorpayOrder({ amount: orderTotal, currency: 'INR' });

        if (!razorpayOrderData) {
            throw new Error("Could not create Razorpay order.");
        }

        const { amount, id: order_id, currency, keyId } = razorpayOrderData;

        const options = {
            key: keyId,
            amount: amount,
            currency: currency,
            name: settings?.site_name || "Sundaraah Showcase",
            description: "Jewelry Purchase",
            order_id: order_id,
            handler: async function (response: any) {
                try {
                    // On successful payment, create the order in our database
                    const orderId = await createOrder({
                        customer_name: userProfile.full_name!,
                        customer_email: userProfile.email!,
                        total: orderTotal,
                        items: cartItems,
                        user_id: user?.id,
                        shipping_fee: finalShippingCost,
                    });
                    
                    clearCart();
                    router.push(`/checkout/success?orderId=${orderId}`);

                } catch (dbError) {
                     console.error("Failed to save order to DB:", dbError);
                     const errorMessage = dbError instanceof Error ? dbError.message : "There was a problem saving your order. Please contact support.";
                     toast({
                       variant: "destructive",
                       title: "Order Failed",
                       description: errorMessage,
                     });
                     setIsLoading(false);
                }
            },
            prefill: {
                name: userProfile.full_name,
                email: userProfile.email,
            },
            theme: {
                color: "#5d1d39"
            }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.on('payment.failed', function (response: any) {
            toast({
                variant: "destructive",
                title: "Payment Failed",
                description: response.error.description,
            });
            setIsLoading(false);
        });
        paymentObject.open();

    } catch (error) {
      console.error("Failed to create order:", error);
      const errorMessage = error instanceof Error ? error.message : "There was a problem placing your order. Please try again.";
      toast({
        variant: "destructive",
        title: "Order Failed",
        description: errorMessage,
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
    <>
    <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
    />
    <div className="container mx-auto px-4 py-16 md:py-24">
      <h1 className="font-headline text-4xl md:text-5xl font-bold text-center mb-12 text-primary">
        Checkout
      </h1>
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Left Side: Summary */}
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Customer & Shipping</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {userProfile ? (
                        <>
                         <p><strong>Name:</strong> {userProfile.full_name}</p>
                         <p><strong>Email:</strong> {userProfile.email}</p>
                         <p className="text-sm text-muted-foreground pt-4">Your order will be shipped to your default shipping address. You can change this in your account profile.</p>
                        </>
                    ) : (
                        <p>Loading your details...</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Payment</CardTitle>
                    <CardDescription>
                        You will be redirected to Razorpay to complete your payment securely.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                        <Lock className="w-3 h-3"/>
                        <span>Payment is secure and encrypted via Razorpay.</span>
                    </div>
                </CardContent>
            </Card>
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
              <Separator className="my-4" />
                <div className="space-y-2 text-muted-foreground">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{formatPrice(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Shipping</span>
                        {isEligibleForFreeShipping ? (
                            <span className="text-green-600">Free</span>
                        ) : (
                            <span>{formatPrice(finalShippingCost)}</span>
                        )}
                    </div>
                </div>
              <Separator className="my-4" />
              <div className="flex justify-between font-bold text-lg mb-6">
                <p>Total</p>
                <p>{formatPrice(orderTotal)}</p>
              </div>
              <Button onClick={handlePlaceOrder} size="lg" className="w-full" disabled={isLoading || !userProfile}>
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Lock className="mr-2 h-5 w-5" />}
                    {isLoading ? "Processing..." : `Pay ${formatPrice(orderTotal)}`}
                </Button>
                 {settings?.free_shipping_threshold && !isEligibleForFreeShipping && cartTotal > 0 &&
                    <p className="text-xs text-center text-muted-foreground mt-4">
                        Add {formatPrice(freeShippingThreshold - cartTotal)} more to get free shipping!
                    </p>
                }
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </>
  );
}
