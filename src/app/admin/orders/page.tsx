
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

export default function OrdersPage() {
    // Mock data for now
    const orders = [
        { id: "ORD001", customer: "Priya Sharma", date: "2023-10-26", total: "$185.00", status: "Fulfilled" },
        { id: "ORD002", customer: "Rahul Kapoor", date: "2023-10-25", total: "$95.00", status: "Processing" },
        { id: "ORD003", customer: "Anjali Mehta", date: "2023-10-24", total: "$75.00", status: "Fulfilled" },
        { id: "ORD004", customer: "Sameer Verma", date: "2023-10-22", total: "$250.00", status: "Cancelled" },
    ]

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "Fulfilled":
                return "default";
            case "Processing":
                return "secondary";
            case "Cancelled":
                return "destructive";
            default:
                return "outline";
        }
    }


  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(order.status) as any}>{order.status}</Badge>
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
