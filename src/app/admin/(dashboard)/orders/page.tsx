
"use client";

import { useState, useEffect } from "react";
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
import { getOrders, updateOrderStatus } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Order } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";


export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchOrders = async () => {
      setIsLoading(true);
      const data = await getOrders();
      setOrders(data);
      setIsLoading(false);
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "Fulfilled": return "default";
            case "Processing": return "secondary";
            case "Cancelled": return "destructive";
            default: return "outline";
        }
    }

    const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
      try {
        await updateOrderStatus(orderId, newStatus);
        toast({
          title: "Success",
          description: `Order status updated to ${newStatus}.`,
        });
        fetchOrders(); // Refresh the list
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update order status.",
        });
      }
    };

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
                <TableHead className="text-center w-[150px]">Status</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id.substring(0,8).toUpperCase()}</TableCell>
                  <TableCell>{order.customer_name}</TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">{formatPrice(order.total)}</TableCell>
                  <TableCell className="text-center">
                    <Select value={order.status} onValueChange={(value) => handleStatusChange(order.id, value as Order['status'])}>
                      <SelectTrigger className={cn("text-xs", {
                          'bg-primary text-primary-foreground': order.status === 'Fulfilled',
                          'bg-secondary text-secondary-foreground': order.status === 'Processing',
                          'bg-destructive text-destructive-foreground': order.status === 'Cancelled',
                      })}>
                        <SelectValue>
                           <Badge variant={getStatusVariant(order.status) as any}>{order.status}</Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Fulfilled">Fulfilled</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
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
