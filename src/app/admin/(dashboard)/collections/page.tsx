
"use client";

import { useEffect, useState, useTransition } from "react";
import { getCollections } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Collection } from "@/types";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { DeleteCollectionButton } from "./delete-collection-button";

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const fetchCollections = () => {
    setIsLoading(true);
    getCollections().then((data) => {
      setCollections(data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleUpdate = () => {
    startTransition(() => {
      fetchCollections();
    });
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Product Collections</h2>
        <Button asChild>
          <Link href="/admin/collections/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Collection
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Your Collections</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(isLoading || isPending) ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : collections.map((collection) => (
                <TableRow key={collection.id}>
                  <TableCell>
                    <Image
                      src={collection.image_url || 'https://placehold.co/100x50.png'}
                      alt={collection.name}
                      width={100}
                      height={50}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{collection.name}</TableCell>
                  <TableCell>{collection.description}</TableCell>
                  <TableCell>
                     <AlertDialog>
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                  <Link href={`/admin/collections/${collection.id}/edit`}>Edit</Link>
                              </DropdownMenuItem>
                               <DeleteCollectionButton collectionId={collection.id} onSuccess={handleUpdate} />
                          </DropdownMenuContent>
                      </DropdownMenu>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
