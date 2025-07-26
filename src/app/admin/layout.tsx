
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
import { Home, Package, Settings, ShoppingCart, BarChart3, Gem } from "lucide-react";
import Link from "next/link";


export const metadata: Metadata = {
  title: "Sundaraah Admin",
  description: "Admin dashboard for Sundaraah Showcase",
};

const adminNavItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: <Home /> },
    { href: "#", label: "Orders", icon: <ShoppingCart /> },
    { href: "#", label: "Products", icon: <Package /> },
    { href: "#", label: "Analytics", icon: <BarChart3 /> },
    { href: "#", label: "Settings", icon: <Settings /> },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
                        <SidebarMenuButton asChild tooltip={item.label} isActive={item.href === '/admin/dashboard'}>
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
                    <SidebarMenuButton asChild tooltip="Go to Frontend">
                        <Link href="/" target="_blank">
                            <Home />
                            <span>Visit Store</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
