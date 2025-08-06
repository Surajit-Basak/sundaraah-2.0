
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import FloatingButtons from "@/components/layout/floating-buttons";
import { WishlistProvider } from "@/context/wishlist-context";
import HeroBanner from "@/components/layout/hero-banner";
import { headers } from "next/headers";

export default function PagesLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const headersList = headers();
    const pathname = headersList.get('next-url') || '';

    return (
        <WishlistProvider>
            <div className="flex min-h-screen flex-col">
                <Header />
                {pathname === '/' && <HeroBanner />}
                <main className="flex-1">{children}</main>
                <Footer />
                <FloatingButtons />
            </div>
        </WishlistProvider>
    );
  }
