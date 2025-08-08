
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { getOrderById } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, User, Package2, Calendar, Hash } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const order = await getOrderById(params.id);

  // Security Check: Ensure the user is viewing their own order
  if (!order || order.user_id !== user.id) {
    notFound();
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
        case "Fulfilled": return "default";
        case "Processing": return "secondary";
        case "Cancelled": return "destructive";
        default: return "outline";
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
       <Button asChild variant="outline" className="mb-8">
            <Link href="/account">
                &larr; Back to My Account
            </Link>
        </Button>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Products Ordered</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Product</TableHead>
                                    <TableHead>Details</TableHead>
                                    <TableHead className="text-center">Qty</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.order_items.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <Image
                                                src={item.product?.imageUrl || 'https://placehold.co/100x100.png'}
                                                alt={item.product?.name || "Product image"}
                                                width={60}
                                                height={60}
                                                className="rounded-md object-cover"
                                            />
                                        </TableCell>
                                         <TableCell>
                                            <Link href={`/shop/${item.product?.slug}`} className="font-medium hover:underline">
                                                {item.product?.name}
                                            </Link>
                                            <p className="text-sm text-muted-foreground">{formatPrice(item.price)}</p>
                                        </TableCell>
                                        <TableCell className="text-center">{item.quantity}</TableCell>
                                        <TableCell className="text-right font-medium">{formatPrice(item.price * item.quantity)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                    <CardDescription>Thank you for your purchase!</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Hash className="w-5 h-5 text-muted-foreground" />
                        <p className="truncate">Order ID: {order.id.substring(0,8).toUpperCase()}</p>
                    </div>
                     <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                        <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Package2 className="w-5 h-5 text-muted-foreground" />
                        <p>Status: <Badge variant={getStatusVariant(order.status) as any}>{order.status}</Badge></p>
                    </div>
                    <Separator />
                     <div className="flex justify-between font-bold text-lg">
                        <span>Total Paid</span>
                        <span>{formatPrice(order.total)}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
