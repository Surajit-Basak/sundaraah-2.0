
"use client";

import { PwaProvider } from "@/context/pwa-context";
import { CartProvider } from "@/context/cart-context";
import { Preloader } from "@/components/layout/preloader";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PwaProvider>
        <CartProvider>
            <Preloader>
                {children}
            </Preloader>
        </CartProvider>
    </PwaProvider>
  );
}
