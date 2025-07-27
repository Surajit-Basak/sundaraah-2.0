
import type {Metadata} from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/cart-context';
import { PwaProvider } from '@/context/pwa-context';
import { getSettings, getPageSeo } from '@/lib/data';

// This function now generates metadata dynamically
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteName = settings?.site_name || 'Sundaraah Showcase';
  const seoData = await getPageSeo('home');
  
  return {
    title: {
      default: seoData?.seo_title || siteName,
      template: `%s | ${siteName}`,
    },
    description: seoData?.meta_description || 'Exquisite Handcrafted Jewelry',
    manifest: '/manifest.json'
  };
}

// Helper to convert HSL string to CSS variable format
const hslToVar = (hslStr: string) => {
  return hslStr.replace('hsl(', '').replace(')', '').replace(/%/g, '');
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  
  const themeStyle = settings?.theme_colors ? `
    :root {
      --background: ${hslToVar(settings.theme_colors.background)};
      --primary: ${hslToVar(settings.theme_colors.primary)};
      --accent: ${hslToVar(settings.theme_colors.accent)};
    }
  ` : '';

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#5d1d39" />
        {themeStyle && <style dangerouslySetInnerHTML={{ __html: themeStyle }} />}
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
