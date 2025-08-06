
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Search, LogOut, User, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { CartSheet } from "../cart/cart-sheet";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/app/auth/actions";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getSettings } from "@/lib/data";
import type { Settings } from "@/types";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      const fetchedSettings = await getSettings();
      setSettings(fetchedSettings);
      
      setIsLoading(false);
    };

    fetchInitialData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase.auth]);


  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);
  
  // Close search when navigating
  useEffect(() => {
    if (isSearchOpen) {
      setIsSearchOpen(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);


  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchTerm = searchInputRef.current?.value;
    if (searchTerm) {
      router.push(`/shop?search=${encodeURIComponent(searchTerm)}`);
      // It will also close because of the pathname change effect
    }
  }

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className={cn(
        "text-lg font-medium transition-colors hover:text-primary",
        pathname === href ? "text-primary" : "text-muted-foreground"
      )}
    >
      {label}
    </Link>
  );

  const siteName = settings?.site_name || "Sundaraah";
  
  const UserButton = () => {
    if (isLoading) {
      return <Button variant="ghost" size="icon" className="text-primary rounded-full w-9 h-9 animate-pulse bg-primary/10"></Button>
    }
    
    if (user) {
      const userInitial = user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U';
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
             <Button variant="ghost" size="icon" aria-label="User Menu" className="text-primary transition-colors hover:bg-primary/10 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback>{userInitial.toUpperCase()}</AvatarFallback>
                </Avatar>
             </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link href="/account">Profile</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/account">My Orders</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/wishlist">My Wishlist</Link></DropdownMenuItem>
            <DropdownMenuSeparator />
             <DropdownMenuItem onSelect={async (e) => { e.preventDefault(); await logout(); }}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    return (
      <Button asChild variant="ghost" size="icon" aria-label="Login" className="text-primary transition-colors hover:bg-primary/10 rounded-full">
          <Link href="/login">
              <User className="h-6 w-6" />
          </Link>
      </Button>
    )
  }

  const Logo = () => {
    if (isLoading) return <Skeleton className="h-10 w-36" />;
    
    if (settings?.header_logo_url) {
        return <Image src={settings.header_logo_url} alt={`${siteName} logo`} width={150} height={40} className="object-contain h-10" priority />;
    }
    
    return <span className="font-headline text-3xl font-bold text-primary">{siteName}</span>;
  }


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 max-w-screen-2xl items-center justify-between px-4 gap-8">
        <Link href="/" className="hidden sm:block">
           <Logo />
        </Link>
        
        {/* Main Navigation & Search Container */}
        <div className={cn("flex-1 flex justify-center items-center transition-all duration-300")}>
            <nav className={cn("hidden md:flex items-center gap-8", isSearchOpen && "hidden")}>
                {navLinks.map((link) => (
                    <NavLink key={link.href} href={link.href} label={link.label} />
                ))}
            </nav>
            <div className={cn("relative w-full max-w-2xl", !isSearchOpen && "hidden")}>
              <form onSubmit={handleSearchSubmit}>
                <Input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search products..."
                  className="w-full pl-12 h-12 text-base rounded-full bg-secondary border-transparent focus:border-primary focus:ring-primary"
                />
                <Search className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground" />
              </form>
            </div>
        </div>

        {/* Right side icons & mobile menu */}
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" aria-label="Toggle Search" onClick={handleSearchToggle} className="text-primary transition-colors hover:bg-primary/10 rounded-full">
            {isSearchOpen ? <X className="h-6 w-6" /> : <Search className="h-6 w-6" />}
          </Button>

          <Button asChild variant="ghost" size="icon" aria-label="Wishlist" className="text-primary transition-colors hover:bg-primary/10 rounded-full">
            <Link href="/wishlist">
                <Heart className="h-6 w-6" />
            </Link>
          </Button>
          
          <CartSheet />

          <UserButton />

          <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 rounded-full">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-4 border-b">
                   <Link href="/" className="font-headline text-2xl font-bold text-primary" onClick={() => setMobileMenuOpen(false)}>
                    {siteName}
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                    <X className="h-6 w-6 text-primary" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>
                <nav className="flex flex-col gap-6 p-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "text-xl font-medium transition-colors hover:text-primary",
                        pathname === link.href ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
