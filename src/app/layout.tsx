
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
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 48 48" 
      width="30px" 
      height="30px"
    >
      <path fill="#fff" d="M4.8,43.2l3.6-13.4c-2-3-3-6.5-3-10.1c0-10.3,8.4-18.7,18.7-18.7c5.1,0,9.9,2,13.5,5.5s5.5,8.4,5.5,13.5 c0,10.3-8.4,18.7-18.7,18.7c-3.6,0-7.1-1-10.1-3L4.8,43.2z"/>
      <path fill="#fff" d="M13.3,37.2l0.4,0.2c2.7,1.6,5.9,2.5,9.3,2.5c8.5,0,15.4-6.9,15.4-15.4c0-4.2-1.7-8.2-4.5-11S28.5,8.8,24,8.8 c-8.5,0-15.4,6.9-15.4,15.4c0,3.5,1.2,6.7,3.2,9.3l0.2,0.4l-2.1,7.9L13.3,37.2z"/>
      <path fill="#40c351" d="M24,4.2c-11,0-19.8,8.9-19.8,19.8c0,3.6,1,7.1,2.8,10.1L4,44l10.5-2.8c3.1,1.8,6.5,2.8,10.2,2.8 C37.8,44,46,35.2,46,24C46,13.1,37.8,4.2,24,4.2z"/>
      <path fill="#fff" d="M34.8,31.2c-0.3-0.1-2-1-2.3-1.1c-0.3-0.1-0.5-0.1-0.7,0.1c-0.2,0.2-0.8,1-1,1.2c-0.2,0.2-0.3,0.2-0.6,0.1 c-0.3-0.1-1.2-0.4-2.3-1.4c-0.8-0.8-1.4-1.7-1.6-2c-0.2-0.3-0.1-0.5,0.1-0.6c0.1-0.1,0.3-0.4,0.5-0.5c0.1-0.1,0.2-0.3,0.2-0.4 c0.1-0.2,0.1-0.3,0-0.4c-0.1-0.1-0.7-1.7-1-2.4c-0.3-0.6-0.5-0.5-0.7-0.5c-0.2,0-0.4,0-0.6,0c-0.2,0-0.6,0.1-0.8,0.4 c-0.3,0.3-1.1,1.1-1.1,2.7c0,1.6,1.2,3.1,1.3,3.3c0.1,0.2,2.2,3.5,5.4,4.8c3.2,1.3,3.2,0.9,3.8,0.8c0.6-0.1,2-0.8,2.2-1.6 c0.3-0.8,0.3-1.5,0.2-1.6C35.4,31.4,35.1,31.3,34.8,31.2z"/>
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
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110"
        >
            <WhatsAppIcon />
        </Link>
      </body>
    </html>
  );
}
