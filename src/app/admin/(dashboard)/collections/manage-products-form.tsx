
"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { addProductToCollection, removeProductFromCollection } from "@/lib/data";
import type { Product } from "@/types";
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

interface ManageProductsFormProps {
  collectionId: string;
  allProducts: Product[];
  productIdsInCollection: string[];
}

export function ManageProductsForm({ collectionId, allProducts, productIdsInCollection }: ManageProductsFormProps) {
  const { toast } = useToast();
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set(productIdsInCollection));
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);

  const handleCheckboxChange = async (productId: string, checked: boolean | "indeterminate") => {
    if (typeof checked !== "boolean") return;
    setLoadingProductId(productId);

    const newSelectedIds = new Set(selectedProductIds);
    let success = false;

    try {
      if (checked) {
        await addProductToCollection(collectionId, productId);
        newSelectedIds.add(productId);
        success = true;
      } else {
        await removeProductFromCollection(collectionId, productId);
        newSelectedIds.delete(productId);
        success = true;
      }
      setSelectedProductIds(newSelectedIds);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `There was a problem ${checked ? 'adding' : 'removing'} the product.`,
      });
    } finally {
      setLoadingProductId(null);
    }
  };

  const filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search for products to add..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      <ScrollArea className="h-96 rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Add</TableHead>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Product Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                    {loadingProductId === product.id ? (
                        <Loader2 className="h-5 w-5 animate-spin"/>
                    ) : (
                        <Checkbox
                            id={`product-${product.id}`}
                            checked={selectedProductIds.has(product.id)}
                            onCheckedChange={(checked) => handleCheckboxChange(product.id, checked)}
                            aria-label={`Select ${product.name}`}
                        />
                    )}
                </TableCell>
                <TableCell>
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={50}
                    height={50}
                    className="rounded-md object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
