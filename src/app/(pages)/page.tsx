
import HeroBanner from "@/components/layout/hero-banner";
import HomePageClient from "./home-page-client";
import { getProducts, getBlogPosts, getTeamMembers, getPageContent, getTestimonials } from "@/lib/data";

// The Home page is now a Server Component.
// It fetches all data on the server and passes it down to the client component.
export default async function Home() {
    const [products, posts, team, content, testimonials] = await Promise.all([
        getProducts(),
        getBlogPosts(),
        getTeamMembers(),
        getPageContent("home"),
        getTestimonials(true),
    ]);

    return (
        <>
            <HeroBanner />
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
