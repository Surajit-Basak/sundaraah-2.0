
"use client";

import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ScrollArea } from "../ui/scroll-area";
import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";

export function CartSheet() {
    const { cartItems, cartCount, cartTotal, removeItem, updateItemQuantity, clearCart } = useCart();
    const [isSheetOpen, setSheetOpen] = useState(false);

    const handleQuantityChange = useDebouncedCallback((productId: string, quantity: number) => {
        updateItemQuantity(productId, quantity);
    }, 300);

    return (
        <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Shopping Cart" className="relative text-primary transition-colors hover:bg-primary/10 rounded-full">
                    <ShoppingCart className="h-6 w-6" />
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                            {cartCount}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
                <SheetHeader className="px-6">
                    <SheetTitle>Shopping Cart ({cartCount})</SheetTitle>
                </SheetHeader>
                {cartCount > 0 ? (
                    <>
                    <ScrollArea className="flex-1">
                        <div className="flex flex-col gap-6 p-6">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex items-start gap-4">
                                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <Link href={`/shop/${item.slug}`} className="font-semibold hover:underline" onClick={() => setSheetOpen(false)}>{item.name}</Link>
                                        <p className="text-sm text-muted-foreground">{formatPrice(item.price)}</p>
                                        <div className="mt-2 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <span className="w-8 text-center">{item.quantity}</span>
                                                <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => removeItem(item.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                    <SheetFooter className="p-6 border-t flex-col gap-4">
                       <div className="flex items-center justify-between font-semibold">
                            <span>Subtotal</span>
                            <span>{formatPrice(cartTotal)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground text-center">Shipping & taxes calculated at checkout.</p>
                        <Button asChild size="lg" className="w-full" onClick={() => setSheetOpen(false)}>
                            <Link href="/checkout">Checkout</Link>
                        </Button>
                        <Button variant="outline" className="w-full" onClick={clearCart}>Clear Cart</Button>
                    </SheetFooter>
                    </>
                ) : (
                    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                        <ShoppingCart className="h-16 w-16 text-muted-foreground" />
                        <h3 className="text-lg font-semibold">Your cart is empty</h3>
                        <p className="text-muted-foreground">Add items to your cart to see them here.</p>
                        <SheetTrigger asChild>
                            <Button asChild>
                                <Link href="/shop">Continue Shopping</Link>
                            </Button>
                        </SheetTrigger>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
