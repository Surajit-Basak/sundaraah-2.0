
import Link from "next/link";
import { Twitter, Facebook, Instagram, Gem } from "lucide-react";
import { getSettings } from "@/lib/data";
import Image from "next/image";

export default async function Footer() {
  const settings = await getSettings();
  const siteName = settings?.site_name || "Sundaraah Showcase";

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand Section */}
          <div className="md:col-span-4 text-center md:text-left">
            <Link href="/" className="inline-block mb-4">
               {settings?.footer_logo_url ? (
                  <Image src={settings.footer_logo_url} alt={`${siteName} logo`} width={240} height={60} className="object-contain h-12 w-auto" />
                ) : (
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                      <Gem className="h-8 w-8 text-accent"/>
                      <h3 className="font-headline text-3xl font-bold">{siteName}</h3>
                  </div>
                )}
            </Link>
            <p className="text-primary-foreground/80 mb-6 max-w-sm mx-auto md:mx-0">
              Crafting timeless elegance and moments of beauty with every piece.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              {settings.social_twitter_enabled && settings.social_twitter_url && (
                <Link href={settings.social_twitter_url} aria-label="Twitter" className="p-2 rounded-full hover:bg-primary-foreground/10 transition-colors">
                  <Twitter className="h-5 w-5" />
                </Link>
              )}
              {settings.social_facebook_enabled && settings.social_facebook_url && (
                <Link href={settings.social_facebook_url} aria-label="Facebook" className="p-2 rounded-full hover:bg-primary-foreground/10 transition-colors">
                  <Facebook className="h-5 w-5" />
                </Link>
              )}
              {settings.social_instagram_enabled && settings.social_instagram_url && (
                <Link href={settings.social_instagram_url} aria-label="Instagram" className="p-2 rounded-full hover:bg-primary-foreground/10 transition-colors">
                  <Instagram className="h-5 w-5" />
                </Link>
              )}
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
              <li><Link href="/return-policy" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Return Policy</Link></li>
              <li><Link href="/shipping-policy" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Shipping Policy</Link></li>
              <li><Link href="/privacy-policy" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

        </div>
        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-sm text-primary-foreground/80">
          <p>&copy; {new Date().getFullYear()} {siteName}. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
