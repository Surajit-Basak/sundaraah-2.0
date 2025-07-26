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
      height="30" 
      width="30" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M18.423 5.576C16.423 3.577 13.822 2.5 11.022 2.5C5.522 2.5 1.022 7 1.022 12.5C1.022 14.532 1.622 16.441 2.622 18.067L1.022 23L6.122 21.43C7.622 22.321 9.322 22.8 11.022 22.8H11.122C16.622 22.8 21.122 18.3 21.122 12.8C21.122 10.046 20.023 7.491 18.423 5.576ZM11.022 20.9C9.522 20.9 8.022 20.4 6.722 19.6L6.322 19.3L2.922 20.2L3.822 16.8L3.522 16.4C2.622 15 2.122 13.4 2.122 12.5C2.122 7.6 6.122 3.6 11.022 3.6C13.522 3.6 15.822 4.6 17.522 6.3C19.222 8 20.122 10.3 20.122 12.8C20.122 17.7 16.122 21.7 11.122 21.7L11.022 20.9ZM15.322 14.8C15.022 14.7 13.622 14 13.322 13.9C13.022 13.8 12.822 13.7 12.622 14C12.422 14.3 11.922 14.9 11.722 15.1C11.522 15.3 11.322 15.3 11.022 15.2C10.722 15.1 9.622 14.7 8.222 13.4C7.222 12.5 6.622 11.4 6.422 11.1C6.222 10.8 6.422 10.6 6.622 10.4C6.722 10.3 6.922 10 7.122 9.8C7.222 9.7 7.322 9.5 7.422 9.4C7.522 9.2 7.522 9.1 7.422 9C7.322 8.9 6.722 7.4 6.422 6.7C6.122 6 5.822 6.1 5.722 6.1C5.522 6.1 5.322 6.1 5.122 6.1C4.922 6.1 4.622 6.2 4.422 6.5C4.222 6.8 3.522 7.4 3.522 8.9C3.522 10.4 4.422 11.8 4.522 12C4.622 12.2 6.022 14.4 8.422 15.5C10.822 16.6 11.222 16.4 11.622 16.4C12.022 16.3 13.122 15.7 13.422 15C13.722 14.3 13.722 13.8 13.622 13.7C13.522 13.6 13.322 13.5 13.022 13.4C12.722 13.3 15.622 14.9 15.322 14.8Z"
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
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110"
        >
            <WhatsAppIcon />
        </Link>
      </body>
    </html>
  );
}
