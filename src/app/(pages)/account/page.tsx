
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getOrdersByUserId } from "@/lib/data";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const metadata = {
    title: "My Account | Sundaraah Showcase",
};

export default async function AccountPage() {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const orders = await getOrdersByUserId(user.id);

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "Fulfilled": return "default";
            case "Processing": return "secondary";
            case "Cancelled": return "destructive";
            default: return "outline";
        }
    }

    return (
        <div className="container mx-auto px-4 py-16 md:py-24">
            <h1 className="font-headline text-4xl font-bold text-primary mb-2">My Account</h1>
            <p className="text-muted-foreground mb-8">Welcome back, {user.email}</p>

            <div className="space-y-8">
                <div>
                    <h2 className="font-headline text-2xl font-bold text-primary mb-4">My Orders</h2>
                    {orders.length > 0 ? (
                        <div className="border rounded-lg">
                             <Table>
                                <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
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
                                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">{formatPrice(order.total)}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={getStatusVariant(order.status) as any}>{order.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button asChild variant="ghost" size="icon">
                                            {/* This page doesn't exist yet, but we can wire it up for the future */}
                                            <Link href={`/account/orders/${order.id}`} title="View Order">
                                            <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-12 px-6 bg-secondary rounded-lg">
                            <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                            <Button asChild className="mt-4">
                                <Link href="/shop">Start Shopping</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
