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
      fill="white"
    >
        <path d="M4.8,43.2l3.6-13.4c-2-3-3-6.5-3-10.1c0-10.3,8.4-18.7,18.7-18.7c5.1,0,9.9,2,13.5,5.5c3.6,3.6,5.5,8.4,5.5,13.5 c0,10.3-8.4,18.7-18.7,18.7c-3.6,0-7.1-1-10.1-3l-13.4,3.6L4.8,43.2z M13.3,37.2l0.4,0.2c2.7,1.6,5.9,2.5,9.3,2.5c8.5,0,15.4-6.9,15.4-15.4 c0-4.2-1.7-8.2-4.5-11s-6.8-4.5-11-4.5c-8.5,0-15.4,6.9-15.4,15.4c0,3.5,1.2,6.7,3.2,9.3l0.2,0.4l-2.1,7.9L13.3,37.2z M24.3,13.6 c-0.5,0-1,0.5-1,1v5.5h-5.5c-0.5,0-1,0.5-1,1s0.5,1,1,1h5.5v5.5c0,0.5,0.5,1,1,1s1-0.5,1-1v-5.5h5.5c0.5,0,1-0.5,1-1s-0.5-1-1-1 h-5.5v-5.5C25.3,14.1,24.8,13.6,24.3,13.6z" />
        <path d="M36.1,32.4 C35.8,32.3,34.4,31.6,34.1,31.5 C33.8,31.4,33.6,31.3,33.4,31.6 C33.2,31.9,32.7,32.5,32.5,32.7 C32.3,32.9,32.1,32.9,31.8,32.8 C31.5,32.7,30.4,32.3,29,31 C28,30.1,27.4,29,27.2,28.7 C27,28.4,27.2,28.2,27.4,28 C27.5,27.9,27.7,27.6,27.9,27.4 C28,27.3,28.1,27.1,28.2,27 C28.3,26.8,28.3,26.7,28.2,26.6 C28.1,26.5,27.5,25,27.2,24.3 C26.9,23.6,26.6,23.7,26.5,23.7 C26.3,23.7,26.1,23.7,25.9,23.7 C25.7,23.7,25.4,23.8,25.2,24.1 C25,24.4,24.3,25,24.3,26.5 C24.3,28,25.2,29.4,25.3,29.6 C25.4,29.8,26.8,32,29.2,33.1 C31.6,34.2,32,34,32.4,34 C32.8,33.9,33.9,33.3,34.2,32.6 C34.5,31.9,34.5,31.4,34.4,31.3 C34.3,31.2,34.1,31.1,33.8,31 C33.5,30.9,36.4,32.5,36.1,32.4 Z" />
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
