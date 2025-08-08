import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import FloatingButtons from "@/components/layout/floating-buttons";
import { WishlistProvider } from "@/context/wishlist-context";

export default function PagesLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
        <WishlistProvider>
            <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
                <FloatingButtons />
            </div>
        </WishlistProvider>
    );
  }
