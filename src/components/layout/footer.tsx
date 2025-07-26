import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Twitter, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h3 className="font-headline text-2xl font-bold mb-2 text-primary">Sundaraah</h3>
            <p className="text-muted-foreground">Crafting moments of beauty.</p>
            <div className="flex space-x-4 mt-4">
              <Link href="#" aria-label="Twitter">
                <Twitter className="h-6 w-6 text-muted-foreground hover:text-primary" />
              </Link>
              <Link href="#" aria-label="Facebook">
                <Facebook className="h-6 w-6 text-muted-foreground hover:text-primary" />
              </Link>
              <Link href="#" aria-label="Instagram">
                <Instagram className="h-6 w-6 text-muted-foreground hover:text-primary" />
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-headline text-lg font-semibold mb-4 text-primary">Shop</h4>
            <ul className="space-y-2">
              <li><Link href="/shop" className="text-muted-foreground hover:text-primary">All Products</Link></li>
              <li><Link href="/shop" className="text-muted-foreground hover:text-primary">Necklaces</Link></li>
              <li><Link href="/shop" className="text-muted-foreground hover:text-primary">Earrings</Link></li>
              <li><Link href="/shop" className="text-muted-foreground hover:text-primary">Bracelets</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline text-lg font-semibold mb-4 text-primary">About Us</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary">Our Story</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-primary">Blog</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline text-lg font-semibold mb-4 text-primary">Newsletter</h4>
            <p className="text-muted-foreground mb-2">Subscribe for updates and offers.</p>
            <form className="flex space-x-2">
              <Input type="email" placeholder="Your email" className="bg-background" />
              <Button type="submit" className="bg-primary hover:bg-primary/90">Subscribe</Button>
            </form>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Sundaraah Showcase. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
