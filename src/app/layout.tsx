
import type {Metadata} from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/cart-context';
import { PwaProvider } from '@/context/pwa-context';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import FloatingButtons from '@/components/layout/floating-buttons';

export const metadata: Metadata = {
  title: 'Sundaraah Showcase',
  description: 'Exquisite Handcrafted Jewelry',
  manifest: '/manifest.json'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The logic to differentiate between admin/public pages is now handled by the presence
  // of this RootLayout's components (Header, Footer) and the admin-specific layout.
  // We can render a simpler body structure here.

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#5d1d39" />
      </head>
      <body className={cn("font-body antialiased")}>
        <PwaProvider>
          <CartProvider>
            {children}
            <Toaster />
          </CartProvider>
        </PwaProvider>
      </body>
    </html>
  );
}
