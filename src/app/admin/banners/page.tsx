
"use client";

import { useEffect, useState, useTransition } from "react";
import { getBanners, deleteBanner } from "@/lib/data";
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
import { MoreHorizontal, PlusCircle, CheckCircle, XCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Banner } from "@/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);
  const { toast } = useToast();

  const fetchBanners = () => {
    setIsLoading(true);
    getBanners().then((data) => {
      setBanners(data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleUpdate = () => {
    startTransition(() => {
      fetchBanners();
    });
  };

  const openDeleteDialog = (banner: Banner) => {
    setBannerToDelete(banner);
    setIsAlertOpen(true);
  };

  const handleDelete = async () => {
    if (!bannerToDelete) return;
    try {
      await deleteBanner(bannerToDelete.id);
      toast({
        title: "Success!",
        description: "Banner has been deleted.",
      });
      handleUpdate();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem deleting the banner.",
      });
    } finally {
      setIsAlertOpen(false);
      setBannerToDelete(null);
    }
  };

  return (
    <>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Home Page Banners</h2>
          <Button asChild>
            <Link href="/admin/banners/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Banner
            </Link>
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Your Banners</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(isLoading || isPending) ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : banners.map((banner) => (
                  <TableRow key={banner.id}>
                    <TableCell>
                      <Image
                        src={banner.image_url}
                        alt={banner.title}
                        width={100}
                        height={50}
                        className="rounded-md object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{banner.title}</TableCell>
                    <TableCell>
                      {banner.is_active ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </TableCell>
                    <TableCell>{banner.sort_order}</TableCell>
                    <TableCell>
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
                                  <Link href={`/admin/banners/${banner.id}/edit`}>Edit</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => openDeleteDialog(banner)}>
                                 Delete
                              </DropdownMenuItem>
                          </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the banner.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
