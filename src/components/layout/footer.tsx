import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Twitter, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h3 className="font-headline text-2xl font-bold mb-2">Sundaraah</h3>
            <p className="text-primary-foreground/80">Crafting moments of beauty.</p>
            <div className="flex space-x-4 mt-4">
              <Link href="#" aria-label="Twitter">
                <Twitter className="h-6 w-6 text-primary-foreground/80 hover:text-primary-foreground" />
              </Link>
              <Link href="#" aria-label="Facebook">
                <Facebook className="h-6 w-6 text-primary-foreground/80 hover:text-primary-foreground" />
              </Link>
              <Link href="#" aria-label="Instagram">
                <Instagram className="h-6 w-6 text-primary-foreground/80 hover:text-primary-foreground" />
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-headline text-lg font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link href="/shop" className="text-primary-foreground/80 hover:text-primary-foreground">All Products</Link></li>
              <li><Link href="/shop" className="text-primary-foreground/80 hover:text-primary-foreground">Necklaces</Link></li>
              <li><Link href="/shop" className="text-primary-foreground/80 hover:text-primary-foreground">Earrings</Link></li>
              <li><Link href="/shop" className="text-primary-foreground/80 hover:text-primary-foreground">Bracelets</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline text-lg font-semibold mb-4">About Us</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-primary-foreground/80 hover:text-primary-foreground">Our Story</Link></li>
              <li><Link href="/blog" className="text-primary-foreground/80 hover:text-primary-foreground">Blog</Link></li>
              <li><Link href="/contact" className="text-primary-foreground/80 hover:text-primary-foreground">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-primary-foreground/80 mb-2">Subscribe for updates and offers.</p>
            <form className="flex space-x-2">
              <Input type="email" placeholder="Your email" className="bg-background text-foreground" />
              <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">Subscribe</Button>
            </form>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-sm text-primary-foreground/80">
          <p>&copy; {new Date().getFullYear()} Sundaraah Showcase. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
