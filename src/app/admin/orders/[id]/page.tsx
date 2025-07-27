

import { notFound } from "next/navigation";
import Image from "next/image";
import { getOrderById } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, User } from "lucide-react";

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const order = await getOrderById(params.id);

  if (!order) {
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
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Order Details</h2>
          <p className="text-muted-foreground">
            Order ID: {order.id.substring(0,8).toUpperCase()} - {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        <Badge variant={getStatusVariant(order.status) as any} className="text-base px-4 py-2">
          {order.status}
        </Badge>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Products Ordered</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Image</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead className="text-center">Quantity</TableHead>
                                <TableHead className="text-right">Price</TableHead>
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
                                    <TableCell className="font-medium">{item.product?.name}</TableCell>
                                    <TableCell className="text-center">{item.quantity}</TableCell>
                                    <TableCell className="text-right">{formatPrice(item.price)}</TableCell>
                                    <TableCell className="text-right">{formatPrice(item.price * item.quantity)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Customer Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-muted-foreground" />
                        <p>{order.customer_name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <a href={`mailto:${order.customer_email}`} className="text-primary hover:underline">
                            {order.customer_email}
                        </a>
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
