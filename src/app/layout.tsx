
import type {Metadata} from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import FloatingButtons from '@/components/layout/floating-buttons';
import { CartProvider } from '@/context/cart-context';
import { PwaProvider } from '@/context/pwa-context';

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
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
            <FloatingButtons />
          </CartProvider>
        </PwaProvider>
      </body>
    </html>
  );
}
