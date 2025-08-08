
"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { getOrdersByUserId, getUserProfile } from "@/lib/data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserCircle, ShoppingCart, Loader2 } from "lucide-react";
import { ProfileForm } from "./profile-form";
import type { Order, UserProfile } from "@/types";
import { cn } from "@/lib/utils";

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "orders">("profile");

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const fetchUserData = async () => {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const [fetchedOrders, fetchedProfile] = await Promise.all([
          getOrdersByUserId(user.id),
          getUserProfile(user.id),
        ]);
        setOrders(fetchedOrders);
        setUserProfile(fetchedProfile);
      }
      setIsLoading(false);
    };
    fetchUserData();
  }, []);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Fulfilled": return "default";
      case "Processing": return "secondary";
      case "Cancelled": return "destructive";
      default: return "outline";
    }
  };
  
  const TabButton = ({ tab, label, icon }: { tab: "profile" | "orders", label: string, icon: React.ReactNode }) => (
    <Button
        variant="ghost"
        onClick={() => setActiveTab(tab)}
        className={cn(
            "w-full justify-start gap-3 text-base px-4 py-6",
            activeTab === tab ? "bg-secondary text-primary font-bold" : "text-muted-foreground"
        )}
    >
        {icon}
        {label}
    </Button>
  )

  if (isLoading) {
    return (
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading your account...</p>
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-8 md:mb-12">My Account</h1>
      
      <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start">
        {/* Left Sidebar for Navigation */}
        <aside className="md:col-span-3">
            <div className="sticky top-24 p-2 rounded-lg bg-secondary/50 space-y-2">
                <TabButton tab="profile" label="My Profile" icon={<UserCircle className="h-5 w-5"/>} />
                <TabButton tab="orders" label="My Orders" icon={<ShoppingCart className="h-5 w-5"/>} />
            </div>
        </aside>

        {/* Right Content */}
        <main className="md:col-span-9">
            {activeTab === 'profile' && userProfile && (
                <div>
                     <h2 className="font-headline text-2xl font-bold text-primary mb-4">My Profile</h2>
                    <ProfileForm userProfile={userProfile} />
                </div>
            )}
            {activeTab === 'orders' && (
                 <div>
                    <h2 className="font-headline text-2xl font-bold text-primary mb-4">My Orders</h2>
                    {orders.length > 0 ? (
                        <div className="border rounded-lg overflow-x-auto">
                             <Table>
                                <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
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
            )}
        </main>
      </div>
    </div>
  );
}
