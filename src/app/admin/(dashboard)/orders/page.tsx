
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getOrders } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function OrdersPage() {
    const orders = await getOrders();

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
      <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id.substring(0,8).toUpperCase()}</TableCell>
                  <TableCell>{order.customer_name}</TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">{formatPrice(order.total)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getStatusVariant(order.status) as any}>{order.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="ghost" size="icon">
                        <Link href={`/admin/orders/${order.id}`}>
                           <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
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
