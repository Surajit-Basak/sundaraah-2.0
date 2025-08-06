
"use client";

import type { Product } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "./ui/button";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Loader2 } from "lucide-react";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, isAdding } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent link navigation if the card is wrapped in a link
    addItem(product, 1);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full group transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <Link href={`/shop/${product.slug}`} className="block overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          data-ai-hint="jewelry product"
          width={400}
          height={400}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </Link>
      <CardHeader className="flex-grow">
        <CardDescription>{product.category}</CardDescription>
        <CardTitle className="font-headline text-xl">
          <Link href={`/shop/${product.slug}`}>{product.name}</Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <p className="text-lg font-semibold text-primary">{formatPrice(product.price)}</p>
        <Button onClick={handleAddToCart} disabled={isAdding} className="bg-accent text-accent-foreground hover:bg-accent/90">
            {isAdding ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <ShoppingCart className="mr-2 h-4 w-4" />}
            Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
}
