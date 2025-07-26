
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
  
  const HeaderIcon = ({ children, ariaLabel, onClick }: { children: React.ReactNode; ariaLabel: string, onClick?: () => void }) => (
     <Button variant="ghost" size="icon" aria-label={ariaLabel} onClick={onClick} className="text-primary transition-colors hover:bg-primary/10 rounded-full">
        {children}
     </Button>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 max-w-screen-2xl items-center justify-between px-4 gap-8">
        <Link href="/" className="font-headline text-3xl font-bold text-primary hidden sm:block">
          Sundaraah
        </Link>
        
        {/* Main Navigation & Search Container */}
        <div className={cn("flex-1 flex justify-center items-center transition-all duration-300")}>
            <nav className={cn("hidden md:flex items-center gap-8", isSearchOpen && "hidden")}>
                {navLinks.map((link) => (
                    <NavLink key={link.href} href={link.href} label={link.label} />
                ))}
            </nav>
            <div className={cn("relative w-full max-w-2xl", !isSearchOpen && "hidden")}>
              <Input
                ref={searchInputRef}
                type="search"
                placeholder="Search products..."
                className="w-full pl-12 h-12 text-base rounded-full bg-secondary border-transparent focus:border-primary focus:ring-primary"
              />
              <Search className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground" />
            </div>
        </div>

        {/* Right side icons & mobile menu */}
        <div className="flex items-center gap-2">
           <HeaderIcon ariaLabel="Toggle Search" onClick={handleSearchToggle}>
            {isSearchOpen ? <X className="h-6 w-6" /> : <Search className="h-6 w-6" />}
          </HeaderIcon>
          
          <HeaderIcon ariaLabel="Shopping Cart">
            <ShoppingCart className="h-6 w-6" />
          </HeaderIcon>

           <HeaderIcon ariaLabel="User Profile">
            <User className="h-6 w-6" />
          </HeaderIcon>

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
