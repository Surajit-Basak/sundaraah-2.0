import Link from "next/link";
import { Twitter, Facebook, Instagram, Gem } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand Section */}
          <div className="md:col-span-4 text-center md:text-left">
            <Link href="/" className="inline-block mb-4">
                <div className="flex items-center gap-2">
                    <Gem className="h-8 w-8 text-accent"/>
                    <h3 className="font-headline text-3xl font-bold">Sundaraah</h3>
                </div>
            </Link>
            <p className="text-primary-foreground/80 mb-6 max-w-sm mx-auto md:mx-0">
              Crafting timeless elegance and moments of beauty with every piece.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <Link href="#" aria-label="Twitter" className="p-2 rounded-full hover:bg-primary-foreground/10 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" aria-label="Facebook" className="p-2 rounded-full hover:bg-primary-foreground/10 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" aria-label="Instagram" className="p-2 rounded-full hover:bg-primary-foreground/10 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden md:block md:col-span-1"></div>

          {/* Links Sections */}
          <div className="md:col-span-2">
            <h4 className="font-headline text-lg font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link href="/shop" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">All Products</Link></li>
              <li><Link href="/shop" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Necklaces</Link></li>
              <li><Link href="/shop" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Earrings</Link></li>
              <li><Link href="/shop" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Bracelets</Link></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h4 className="font-headline text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Our Story</Link></li>
              <li><Link href="/blog" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
           <div className="md:col-span-2">
            <h4 className="font-headline text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">FAQ</Link></li>
              <li><Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Shipping & Returns</Link></li>
              <li><Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Care Guide</Link></li>
            </ul>
          </div>

        </div>
        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-sm text-primary-foreground/80">
          <p>&copy; {new Date().getFullYear()} Sundaraah Showcase. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
