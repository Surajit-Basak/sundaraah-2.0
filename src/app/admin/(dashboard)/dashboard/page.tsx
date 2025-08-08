
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProducts, getOrders } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { DollarSign, Package, CreditCard, Activity } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

export default async function DashboardPage() {
  const [products, allOrders] = await Promise.all([
    getProducts(),
    getOrders()
  ]);
  
  const totalProducts = products.length;
  const fulfilledOrders = allOrders.filter(order => order.status === 'Fulfilled');
  const totalRevenue = fulfilledOrders.reduce((sum, order) => sum + order.total, 0);
  const totalSales = fulfilledOrders.length;
  const recentSales = allOrders.slice(0, 5);

  const getStatusVariant = (status: string) => {
    switch (status) {
        case "Fulfilled": return "default";
        case "Processing": return "secondary";
        case "Cancelled": return "destructive";
        default: return "outline";
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Based on fulfilled orders
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalSales}</div>
            <p className="text-xs text-muted-foreground">
              Total fulfilled orders
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Number of products in store
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{allOrders.filter(o => o.status === 'Processing').length}</div>
            <p className="text-xs text-muted-foreground">
              Orders requiring fulfillment
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-4">
            <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                <CardTitle>Recent Sales</CardTitle>
                </div>
                <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="/admin/orders">
                    View All
                    <ArrowUpRight className="h-4 w-4" />
                </Link>
                </Button>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="hidden sm:table-cell text-right">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentSales.map(order => (
                             <TableRow key={order.id}>
                                <TableCell>
                                    <div className="font-medium">{order.customer_name}</div>
                                    <div className="text-sm text-muted-foreground truncate">{order.customer_email}</div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant={getStatusVariant(order.status) as any}>{order.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right">{formatPrice(order.total)}</TableCell>
                                <TableCell className="hidden sm:table-cell text-right">{new Date(order.created_at).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                 </Table>
            </CardContent>
        </Card>
        <Card className="col-span-full lg:col-span-3">
             <CardHeader>
                <CardTitle>Welcome, Admin!</CardTitle>
             </CardHeader>
             <CardContent>
                <p className="text-muted-foreground">This is your control center. You can manage products, orders, blog posts, and more using the sidebar navigation.</p>
             </CardContent>
        </Card>
      </div>
    </div>
  );
}
