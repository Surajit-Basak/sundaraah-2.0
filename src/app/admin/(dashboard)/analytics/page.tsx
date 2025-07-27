
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrders } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { DollarSign, CreditCard, Activity, Package } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import type { Order } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsPage() {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const orders = await getOrders();
      setAllOrders(orders);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const fulfilledOrders = allOrders.filter(order => order.status === 'Fulfilled');
  const totalRevenue = fulfilledOrders.reduce((sum, order) => sum + order.total, 0);
  const totalSales = fulfilledOrders.length;
  const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

  // Process data for chart
  const monthlyRevenue = fulfilledOrders.reduce((acc, order) => {
    const month = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += order.total;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.keys(monthlyRevenue).map(month => ({
    name: month,
    total: monthlyRevenue[month],
  })).reverse(); // Show most recent months first

  const getStatusVariant = (status: string) => {
    switch (status) {
        case "Fulfilled": return "default";
        case "Processing": return "secondary";
        case "Cancelled": return "destructive";
        default: return "outline";
    }
  }
  
  if (isLoading) {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card><CardHeader><Skeleton className="h-5 w-32" /></CardHeader><CardContent><Skeleton className="h-8 w-24" /></CardContent></Card>
                <Card><CardHeader><Skeleton className="h-5 w-32" /></CardHeader><CardContent><Skeleton className="h-8 w-24" /></CardContent></Card>
                <Card><CardHeader><Skeleton className="h-5 w-32" /></CardHeader><CardContent><Skeleton className="h-8 w-24" /></CardContent></Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4"><CardHeader><Skeleton className="h-6 w-32" /></CardHeader><CardContent><Skeleton className="h-[350px] w-full" /></CardContent></Card>
                <Card className="col-span-3"><CardHeader><Skeleton className="h-6 w-32" /></CardHeader><CardContent><Skeleton className="h-[350px] w-full" /></CardContent></Card>
            </div>
        </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">From fulfilled orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fulfilled Sales</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalSales}</div>
            <p className="text-xs text-muted-foreground">Total fulfilled orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(averageOrderValue)}</div>
            <p className="text-xs text-muted-foreground">Average across all sales</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                    <XAxis
                        dataKey="name"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${formatPrice(value as number)}`}
                    />
                    <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
                {allOrders.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allOrders.slice(0, 10).map(order => (
                                    <TableRow key={order.id}>
                                    <TableCell>
                                        <div className="font-medium">{order.customer_name}</div>
                                        <div className="hidden text-sm text-muted-foreground md:inline">
                                            {order.customer_email}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={getStatusVariant(order.status) as any}>{order.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">{formatPrice(order.total)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center h-[200px] text-muted-foreground">
                        <Package className="h-12 w-12 mb-4" />
                        <p>No orders found yet.</p>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
