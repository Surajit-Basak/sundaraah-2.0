"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ShoppingCart, User, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

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
  const pathname = usePathname();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <Link href="/" className="font-headline text-2xl font-bold text-primary">
          Sundaraah
        </Link>
        
        <div className={cn("absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4 transition-all duration-300 md:relative md:left-auto md:top-auto md:translate-x-0 md:translate-y-0 md:w-auto md:max-w-none md:p-0", isSearchOpen ? 'opacity-100 visible' : 'opacity-0 invisible md:opacity-100 md:visible')}>
            <nav className={cn("hidden md:flex gap-6", isSearchOpen && "md:hidden")}>
                {navLinks.map((link) => (
                    <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        pathname === link.href ? "text-primary" : "text-muted-foreground"
                    )}
                    >
                    {link.label}
                    </Link>
                ))}
            </nav>
            <div className={cn("relative", !isSearchOpen && "hidden", isSearchOpen && "w-full")}>
              <Input
                ref={searchInputRef}
                type="search"
                placeholder="Search products..."
                className="w-full pl-10"
              />
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleSearchToggle}>
            {isSearchOpen ? <X className="h-5 w-5 text-primary" /> : <Search className="h-5 w-5 text-primary" />}
            <span className="sr-only">Search</span>
          </Button>
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <span className="sr-only">Shopping Cart</span>
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5 text-primary" />
            <span className="sr-only">User Profile</span>
          </Button>
          <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-primary" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-4 border-b">
                   <Link href="/" className="font-headline text-2xl font-bold text-primary" onClick={() => setMobileMenuOpen(false)}>
                    Sundaraah
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
                        "text-lg font-medium transition-colors hover:text-primary",
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
