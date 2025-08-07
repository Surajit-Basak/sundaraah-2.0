
import HeroBanner from "@/components/layout/hero-banner";
import HomePageClient from "./home-page-client";
import { getProducts, getBlogPosts, getTeamMembers, getPageContent, getTestimonials, getBanners } from "@/lib/data";
import type { Banner } from "@/types";

// The Home page is now a Server Component.
// It fetches all data on the server and passes it down to the client component.
export default async function Home() {
    const [products, posts, team, content, testimonials, banners] = await Promise.all([
        getProducts(),
        getBlogPosts(),
        getTeamMembers(),
        getPageContent("home"),
        getTestimonials(true),
        getBanners()
    ]);

    return (
        <>
            <HeroBanner banners={banners} />
            <HomePageClient
                allProducts={products}
                recentPosts={posts}
                mainArtisan={team[1] ?? null} // Example: selecting a specific artisan
                pageContent={content}
                testimonials={testimonials}
            />
        </>
    )
}
