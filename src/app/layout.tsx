
import type {Metadata} from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sundaraah Showcase',
  description: 'Exquisite Handcrafted Jewelry',
};

// WhatsApp Icon component for better reusability
const WhatsAppIcon = () => (
  <svg
    width="32px"
    height="32px"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
  >
    <path
      fill="#40C351"
      d="M16,2a14,14,0,1,0,14,14A14,14,0,0,0,16,2Z"
    />
    <path
      fill="#FFFFFF"
      d="M23,19.33a10.82,10.82,0,0,1-5.18-1.42,1,1,0,0,0-1,.2L15.39,19a.29.29,0,0,1-.37,0,7.63,7.63,0,0,1-3.6-3.6.29.29,0,0,1,0-.37l.86-1.43a1,1,0,0,0,.2-1,10.82,10.82,0,0,1-1.42-5.18,1,1,0,0,0-1-1H9a1,1,0,0,0-1,1,6.58,6.58,0,0,0,2,4.89,8.51,8.51,0,0,0,5.2,2.83H15.5a6.5,6.5,0,0,0,6.33-5.25,1,1,0,0,0-1-1.16Z"
    />
  </svg>
);

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
      </head>
      <body className={cn("font-body antialiased")}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
        <Link 
            href="https://wa.me/1234567890" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm text-white shadow-lg transition-transform hover:scale-110"
        >
            <WhatsAppIcon />
        </Link>
      </body>
    </html>
  );
}
