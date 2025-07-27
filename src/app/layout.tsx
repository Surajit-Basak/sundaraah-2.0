
import type {Metadata} from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { getSettings, getPageSeo } from '@/lib/data';
import { Providers } from './providers';

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

// Helper to create the Google Fonts URL
const createFontUrl = (fonts: { body: string; headline: string; }) => {
    const familyParams = [
        `family=${fonts.headline.replace(/ /g, '+')}:wght@400;700`,
        `family=${fonts.body.replace(/ /g, '+')}:wght@400;700`
    ].join('&');
    return `https://fonts.googleapis.com/css2?${familyParams}&display=swap`;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  
  const themeStyle = settings ? `
    :root {
      --background: ${hslToVar(settings.theme_colors.background)};
      --primary: ${hslToVar(settings.theme_colors.primary)};
      --accent: ${hslToVar(settings.theme_colors.accent)};
    }
    body {
      font-family: "${settings.theme_fonts.body}", sans-serif;
    }
    h1, h2, h3, h4, h5, h6, .font-headline {
      font-family: "${settings.theme_fonts.headline}", serif;
    }
  ` : '';

  const fontUrl = settings ? createFontUrl(settings.theme_fonts) : '';

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {fontUrl && <link href={fontUrl} rel="stylesheet" />}
        <meta name="theme-color" content="#5d1d39" />
        {themeStyle && <style dangerouslySetInnerHTML={{ __html: themeStyle }} />}
      </head>
      <body className={cn("font-body antialiased")}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
