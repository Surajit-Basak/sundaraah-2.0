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
      height="24"
      width="24"
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 47.601 47.601"
      xmlSpace="preserve"
      fill="currentColor"
    >
      <g>
        <path d="M47.245,22.913C47.245,10.256,36.989,0,24.332,0C11.675,0,1.42,10.256,1.42,22.913c0,4.896,1.58,9.458,4.321,13.218L0,47.601 l11.875-5.613c3.554,2.229,7.697,3.526,12.101,3.526h0.001c0,0,0,0,0,0c12.657,0,22.913-10.256,22.913-22.913 M24.332,42.245 c-3.963,0-7.726-1.248-10.829-3.46l-1.42-0.84l-8.02,3.788l3.858-7.864l-0.92-1.508c-2.583-4.218-4.015-9.146-4.015-14.349 C2.999,12.007,12.682,2.333,24.332,2.333c11.65,0,21.332,9.674,21.332,21.332c0,11.658-9.683,21.332-21.332,21.332 M34.96,28.988c-0.344-0.173-2.037-1.003-2.353-1.116c-0.317-0.114-0.548-0.173-0.78,0.173 c-0.231,0.345-0.889,1.116-1.091,1.347c-0.201,0.232-0.402,0.261-0.748,0.087s-1.468-0.54-2.796-1.724 c-1.036-0.921-1.725-2.055-1.926-2.4c-0.202-0.345-0.021-0.533,0.152-0.707c0.158-0.158,0.345-0.402,0.518-0.604 c0.173-0.201,0.231-0.345,0.345-0.576c0.114-0.231,0.057-0.433-0.028-0.604c-0.086-0.173-0.78-1.87-1.068-2.564 c-0.288-0.695-0.576-0.59-0.78-0.59c-0.189,0-0.402-0.015-0.604-0.015s-0.548,0.086-0.835,0.433 c-0.288,0.345-1.09,1.06-1.09,2.592c0,1.532,1.118,3.003,1.262,3.205c0.144,0.201,2.195,3.492,5.32,4.72 c0.748,0.289,1.334,0.462,1.794,0.59c0.747,0.201,1.439,0.173,1.984-0.114c0.604-0.317,1.819-1.952,2.078-2.678 c0.259-0.726,0.259-1.347,0.173-1.46Z"/>
      </g>
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
