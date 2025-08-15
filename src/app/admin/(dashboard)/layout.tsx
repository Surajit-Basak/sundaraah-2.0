
import * as React from "react";
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
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Home, Package, Settings, ShoppingCart, BarChart3, Gem, LogOut, BookOpen, Users, ImageIcon, FileText, FolderKanban, GalleryHorizontal, Search, Star, Mail, Tags, Heart } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getSettings } from "@/lib/data";
import Image from "next/image";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const settings = await getSettings();
  
  // We need to adjust how we get the pathname, as it will include the group
  const rawPathname = headers().get('next-url') || '';
  const pathname = rawPathname.replace('/(dashboard)', '');


  // This is a failsafe, middleware should handle redirection primarily.
  if (!user) {
    redirect('/admin/login');
  }

  const navItems = {
    "Store Management": [
      { href: "/admin/dashboard", label: "Dashboard", icon: <Home /> },
      { href: "/admin/orders", label: "Orders", icon: <ShoppingCart /> },
      { href: "/admin/products", label: "Products", icon: <Package /> },
      { href: "/admin/categories", label: "Categories", icon: <Tags /> },
      { href: "/admin/collections", label: "Collections", icon: <FolderKanban /> },
      { href: "/admin/reviews", label: "Reviews", icon: <Star /> },
      { href: "/admin/wishlist", label: "Wishlist", icon: <Heart /> },
    ],
    "Content Management": [
      { href: "/admin/blog", label: "Blog", icon: <BookOpen /> },
      { href: "/admin/pages", label: "Page Content", icon: <FileText /> },
      { href: "/admin/banners", label: "Banners", icon: <ImageIcon /> },
      { href: "/admin/media", label: "Media", icon: <GalleryHorizontal /> },
      { href: "/admin/team", label: "Team", icon: <Users /> },
      { href: "/admin/testimonials", label: "Testimonials", icon: <Star /> },
    ],
    "Administration": [
        { href: "/admin/users", label: "Users", icon: <Users /> },
        { href: "/admin/emails", label: "Emails", icon: <Mail /> },
        { href: "/admin/analytics", label: "Analytics", icon: <BarChart3 /> },
        { href: "/admin/seo", label: "SEO", icon: <Search /> },
        { href: "/admin/settings", label: "Settings", icon: <Settings /> },
    ]
  }

  const handleLogout = async () => {
    'use server';
    const supabase = createSupabaseServerClient();
    await supabase.auth.signOut();
    redirect('/admin/login');
  }
  
  const siteName = settings?.site_name || "Sundaraah";

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2 h-14">
              {settings?.header_logo_url ? (
                <Image src={settings.header_logo_url} alt={`${siteName} logo`} width={240} height={60} className="object-contain max-h-full w-auto group-data-[state=collapsed]:hidden" />
              ) : (
                <h3 className="font-headline text-2xl font-bold text-primary group-data-[state=collapsed]:hidden">{siteName}</h3>
              )}
              <Gem className="h-6 w-6 text-accent group-data-[state=expanded]:hidden mx-auto"/>
              <div className="flex-1" />
              <SidebarTrigger className="group-data-[state=collapsed]:hidden" />
            </div>
          </SidebarHeader>
          <SidebarContent>
              <SidebarMenu>
                  {Object.entries(navItems).map(([group, items]) => (
                      <React.Fragment key={group}>
                          <SidebarSeparator />
                          {items.map((item) => (
                              <SidebarMenuItem key={item.label}>
                                  <SidebarMenuButton asChild tooltip={item.label} isActive={pathname.startsWith(item.href) && item.href !== '#'}>
                                      <Link href={item.href}>
                                          {item.icon}
                                          <span>{item.label}</span>
                                      </Link>
                                  </SidebarMenuButton>
                              </SidebarMenuItem>
                          ))}
                      </React.Fragment>
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
                  <SidebarMenuItem>
                    <SidebarTrigger className="w-full" />
                  </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
