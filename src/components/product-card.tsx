
import type { Product } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "./ui/button";
import { formatPrice } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
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
        <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Link href={`/shop/${product.slug}`}>View Item</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
