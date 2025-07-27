
import type { Metadata } from "next";
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Home, Package, Settings, ShoppingCart, BarChart3, Gem, LogOut, BookOpen, Users, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sundaraah Admin",
  description: "Admin dashboard for Sundaraah Showcase",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const pathname = headers().get('next-url') || '';
  const isLoginPage = pathname === '/admin/login';

  // If on login page, render children directly without the sidebar layout
  if (isLoginPage) {
    return <div className="bg-secondary">{children}</div>
  }
  
  // This is a failsafe. Middleware should handle redirection.
  if (!user || user.user_metadata.user_role !== 'admin') {
    redirect('/admin/login');
  }

  const adminNavItems = [
      { href: "/admin/dashboard", label: "Dashboard", icon: <Home /> },
      { href: "/admin/orders", label: "Orders", icon: <ShoppingCart /> },
      { href: "/admin/products", label: "Products", icon: <Package /> },
      { href: "/admin/blog", label: "Blog", icon: <BookOpen /> },
      { href: "/admin/team", label: "Team", icon: <Users /> },
      { href: "/admin/banners", label: "Banners", icon: <ImageIcon /> },
      { href: "#", label: "Analytics", icon: <BarChart3 /> },
      { href: "#", label: "Settings", icon: <Settings /> },
  ]

  const handleLogout = async () => {
    'use server';
    const supabase = createSupabaseServerClient();
    await supabase.auth.signOut();
    redirect('/admin/login');
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Gem className="h-8 w-8 text-accent"/>
            <h3 className="font-headline text-2xl font-bold text-primary group-data-[collapsible=icon]:hidden">Sundaraah</h3>
            <div className="flex-1" />
            <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />
          </div>
        </SidebarHeader>
        <SidebarContent>
            <SidebarMenu>
                {adminNavItems.map((item) => (
                    <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton asChild tooltip={item.label} isActive={pathname.startsWith(item.href) && item.href !== '#'}>
                            <Link href={item.href}>
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <SidebarMenu>
                <SidebarMenuItem>
                    <form action={handleLogout} className="w-full">
                        <SidebarMenuButton tooltip="Logout" type="submit" className="w-full">
                            <LogOut />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </form>
                </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
