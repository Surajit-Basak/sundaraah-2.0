
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Search, Heart, Home, ShoppingBag, Contact, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { CartSheet } from "../cart/cart-sheet";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSettings } from "@/lib/data";
import Image from "next/image";
import HeaderClientActions from "./header-client-actions";

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
  const siteName = settings?.site_name || "Sundaraah";
  
  const Logo = () => {
    if (settings?.header_logo_url) {
        return <Image src={settings.header_logo_url} alt={`${siteName} logo`} width={180} height={45} className="object-contain h-10 w-auto" priority />;
    }
    return <span className="font-headline text-3xl font-bold text-primary">{siteName}</span>;
  }

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 max-w-screen-2xl items-center justify-between px-4 gap-8">
        <Link href="/" className="hidden sm:block">
           <Logo />
        </Link>
        
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
                    className="flex flex-col items-center justify-center gap-1 w-full h-full transition-colors text-muted-foreground"
                >
                    {link.icon}
                    <span className="text-xs">{link.label}</span>
                </Link>
            ))}
        </div>
    </nav>
    </>
  );
}
