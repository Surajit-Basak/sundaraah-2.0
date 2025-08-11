
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Menu, X, Search, LogOut, User, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { CartSheet } from "../cart/cart-sheet";
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
import Image from "next/image";

interface HeaderClientActionsProps {
    user: SupabaseUser | null;
    siteName: string;
    logoUrl: string | null | undefined;
    navLinks: { href: string, label: string }[];
}

export default function HeaderClientActions({ user, siteName, logoUrl, navLinks }: HeaderClientActionsProps) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);
  
  // Close search and mobile menu when navigating
  useEffect(() => {
    if (isSearchOpen) {
      setIsSearchOpen(false);
    }
    if (isMobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchTerm = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value;
    if (searchTerm) {
      router.push(`/shop?search=${encodeURIComponent(searchTerm)}`);
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

  const UserButton = () => {
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

  return (
    <>
      <div className="flex-1 flex justify-center items-center">
        {isSearchOpen ? (
           <div className="relative w-full max-w-2xl">
            <form onSubmit={handleSearchSubmit}>
              <Input
                ref={searchInputRef}
                name="search"
                type="search"
                placeholder="Search products..."
                className="w-full pl-12 h-12 text-base rounded-full bg-secondary border-transparent focus:border-primary focus:ring-primary"
              />
              <Search className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground" />
            </form>
          </div>
        ) : (
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
          </nav>
        )}
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
         <Button variant="ghost" size="icon" aria-label="Toggle Search" onClick={handleSearchToggle} className="hidden md:inline-flex text-primary transition-colors hover:bg-primary/10 rounded-full">
          {isSearchOpen ? <X className="h-6 w-6" /> : <Search className="h-6 w-6" />}
        </Button>
        
        <div className="hidden md:flex">
           <Button asChild variant="ghost" size="icon" aria-label="Wishlist" className="text-primary transition-colors hover:bg-primary/10 rounded-full">
              <Link href="/wishlist">
                  <Heart className="h-6 w-6" />
              </Link>
           </Button>
        </div>
        
        <CartSheet />

        <div className="hidden md:flex">
          <UserButton />
        </div>

        <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 rounded-full">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background p-0 flex flex-col">
            <SheetHeader className="p-4 border-b">
                <SheetTitle asChild>
                     <Link href="/" className="inline-block" onClick={() => setMobileMenuOpen(false)}>
                        {logoUrl ? (
                             <Image src={logoUrl} alt={`${siteName} logo`} width={180} height={45} className="object-contain max-h-10 w-auto" />
                        ) : (
                             <span className="font-headline text-2xl font-bold text-primary">{siteName}</span>
                        )}
                    </Link>
                </SheetTitle>
            </SheetHeader>
            <div className="p-4">
                 <form onSubmit={handleSearchSubmit}>
                    <div className="relative">
                        <Input
                            name="search"
                            type="search"
                            placeholder="Search..."
                            className="w-full pl-10 h-10 text-base"
                        />
                         <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    </div>
                </form>
            </div>
              <nav className="flex flex-col gap-4 p-4">
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
              <div className="mt-auto p-4 border-t">
                  <UserButton />
              </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
