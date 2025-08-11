
import * as React from "react";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSettings } from "@/lib/data";
import Image from "next/image";
import HeaderClientActions from "./header-client-actions";
import { Skeleton } from "../ui/skeleton";
import { Home, ShoppingBag, Heart, User } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const mobileNavLinks = [
    { href: "/", label: "Home", icon: <Home className="h-6 w-6" /> },
    { href: "/shop", label: "Shop", icon: <ShoppingBag className="h-6 w-6" /> },
    { href: "/wishlist", label: "Wishlist", icon: <Heart className="h-6 w-6" /> },
    { href: "/account", label: "Account", icon: <User className="h-6 w-6" /> },
]

export default async function Header() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const settings = await getSettings();
  const siteName = settings?.site_name || "Sundaraah Showcase";
  
  const Logo = () => {
    if (settings?.header_logo_url) {
        return <Image src={settings.header_logo_url} alt={`${siteName} logo`} width={240} height={60} className="object-contain max-h-12 w-auto" priority />;
    }
    return <span className="font-headline text-3xl font-bold text-primary">{siteName}</span>;
  }
  
  const LogoSkeleton = () => (
    <Skeleton className="h-10 w-40" />
  );

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 max-w-screen-2xl items-center justify-between px-4 gap-4">
        <div className="flex-shrink-0">
          <Link href="/">
            <React.Suspense fallback={<LogoSkeleton />}>
              <Logo />
            </React.Suspense>
          </Link>
        </div>
        
        <HeaderClientActions user={user} siteName={siteName} navLinks={navLinks} />

      </div>
    </header>

     {/* Mobile Bottom Navigation */}
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
        <div className="container mx-auto flex justify-around items-center h-16 px-2">
            {mobileNavLinks.map(link => (
                <Link 
                    key={link.href} 
                    href={link.href}
                    className="flex flex-col items-center justify-center gap-1 w-full h-full transition-colors text-muted-foreground hover:text-primary"
                >
                    {link.icon}
                    <span className="text-xs">{link.label}</span>
                </Link>
            ))}
        </div>
    </nav>
    <div className="block h-16 md:hidden"></div>
    </>
  );
}
