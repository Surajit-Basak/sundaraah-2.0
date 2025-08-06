
"use client";

import { PwaProvider } from "@/context/pwa-context";
import { CartProvider } from "@/context/cart-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PwaProvider>
        <CartProvider>
            {children}
        </CartProvider>
    </PwaProvider>
  );
}
