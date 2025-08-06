
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Gem, HandHeart, Sparkles } from "lucide-react";
import ProductCard from "@/components/product-card";
import BlogPostCard from "@/components/blog-post-card";
import { getProducts, getBlogPosts, getTeamMembers, getPageContent, getTestimonials } from "@/lib/data";
import TestimonialCard from "@/components/testimonial-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Input } from "@/components/ui/input";
import type { Product, BlogPost, TeamMember, PageContent, Testimonial } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

// Helper to extract content from fetched data
const getContent = (sections: PageContent[], sectionName: string) => {
  return sections.find(s => s.section === sectionName)?.content || {};
};

export default function Home() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [mainArtisan, setMainArtisan] = useState<TeamMember | null>(null);
  const [pageContent, setPageContent] = useState<PageContent[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [products, posts, team, content, fetchedTestimonials] = await Promise.all([
        getProducts(),
        getBlogPosts(),
        getTeamMembers(),
        getPageContent("home"),
        getTestimonials(true),
      ]);
      setAllProducts(products);
      setRecentPosts(posts);
      setMainArtisan(team[1] ?? null); // Rohan Verma, Master Artisan
      setPageContent(content);
      setTestimonials(fetchedTestimonials);
      setIsLoading(false);
    };
    fetchData();
  }, []);
  
  const featuredProducts = allProducts.slice(0, 6);
  const trendingProducts = allProducts.slice(3, 9).sort(() => 0.5 - Math.random());
  const bestSellers = allProducts.slice(1, 7).sort(() => 0.5 - Math.random());
  
  const craftsmanshipContent = getContent(pageContent, 'craftsmanship');
  const giftingContent = getContent(pageContent, 'gifting');
  const newsletterContent = getContent(pageContent, 'newsletter');

  const categories = [
    { name: "Necklaces", href: "/shop", imageUrl: "https://placehold.co/400x500.png", hint: "necklace jewelry" },
    { name: "Earrings", href: "/shop", imageUrl: "https://placehold.co/400x500.png", hint: "earrings jewelry" },
    { name: "Bracelets", href: "/shop", imageUrl: "https://placehold.co/400x500.png", hint: "bracelet jewelry" },
    { name: "Rings", href: "/shop", imageUrl: "https://placehold.co/400x500.png", hint: "ring jewelry" },
    { name: "Anklets", href: "/shop", imageUrl: "https://placehold.co/400x500.png", hint: "anklet jewelry" },
  ];

  const features = [
    {
      icon: <HandHeart className="w-10 h-10 text-accent" />,
      title: "Handcrafted with Love",
      description: "Each piece is uniquely designed and meticulously crafted by our skilled artisans.",
    },
    {
      icon: <Gem className="w-10 h-10 text-accent" />,
      title: "Ethically Sourced",
      description: "We use only the finest, ethically sourced materials for our jewelry.",
    },
    {
      icon: <Sparkles className="w-10 h-10 text-accent" />,
      title: "Timeless Designs",
      description: "Our jewelry is created to be cherished for generations, blending classic and modern styles.",
    },
  ];

  const ProductCarousel = ({products}: {products: Product[]}) => (
     <Carousel opts={{ align: "start", loop: true }}>
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 p-4">
            <ProductCard product={product} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );

  const ProductCarouselSkeleton = () => (
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            </div>
        ))}
    </div>
  )

  return (
    <div className="flex flex-col">
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-background mb-6 shadow-md">
                  {feature.icon}
                </div>
                <h3 className="font-headline text-2xl font-semibold text-primary mb-2">{feature.title}</h3>
                <p className="text-muted-foreground max-w-xs">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            {getContent(pageContent, 'featured_products').title || "Featured Collection"}
          </h2>
          {isLoading ? <ProductCarouselSkeleton/> : <ProductCarousel products={featuredProducts} />}
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Link href="/shop">
                View All Products
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            {getContent(pageContent, 'categories').title || "Shop by Category"}
          </h2>
          <Carousel opts={{ align: "start" }}>
            <CarouselContent>
              {categories.map((category) => (
                 <CarouselItem key={category.name} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 p-4">
                    <Link href={category.href} className="group relative block overflow-hidden rounded-lg shadow-lg h-full">
                      <Image 
                        src={category.imageUrl} 
                        alt={category.name} 
                        data-ai-hint={category.hint}
                        width={400} 
                        height={500} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-colors duration-300 group-hover:bg-black/30">
                        <h3 className="font-headline text-2xl font-bold text-white drop-shadow-md">{category.name}</h3>
                      </div>
                    </Link>
                 </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            {getContent(pageContent, 'trending').title || "Trending Now"}
          </h2>
          {isLoading ? <ProductCarouselSkeleton/> : <ProductCarousel products={trendingProducts} />}
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="prose prose-lg max-w-none text-foreground">
              <h2 className="font-headline text-3xl md:text-4xl text-primary mb-4">{craftsmanshipContent.title || "The Soul of Sundaraah"}</h2>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ) : (
                <>
                <p>{craftsmanshipContent.paragraph1}</p>
                <p>{craftsmanshipContent.paragraph2}</p>
                </>
              )}
              <Button asChild variant="link" className="text-accent p-0 mt-4 text-lg">
                <Link href="/about">
                  Meet Our Artisans <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="aspect-square relative">
              <Image
                src={craftsmanshipContent.image_url || "https://placehold.co/600x600.png"}
                alt={craftsmanshipContent.title || "Artisan at work"}
                data-ai-hint="artisan jewelry"
                width={600}
                height={600}
                className="rounded-lg shadow-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
       <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            {getContent(pageContent, 'bestsellers').title || "Our Best Sellers"}
          </h2>
          {isLoading ? <ProductCarouselSkeleton/> : <ProductCarousel products={bestSellers} />}
        </div>
      </section>
      
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            {getContent(pageContent, 'testimonials').title || "Words from Our Customers"}
          </h2>
          {testimonials.length > 0 && (
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent>
                {testimonials.map((testimonial) => (
                  <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3 p-4">
                     <TestimonialCard {...testimonial} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          )}
        </div>
      </section>

       <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="relative bg-primary text-primary-foreground rounded-lg shadow-xl overflow-hidden">
            <div className="absolute inset-0">
                <Image 
                    src="https://placehold.co/1200x400.png"
                    alt="Elegant gift wrapping"
                    data-ai-hint="elegant gift"
                    fill
                    className="object-cover opacity-20"
                />
            </div>
            <div className="relative text-center p-12 md:p-20">
              <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">{giftingContent.title || "The Art of Gifting"}</h2>
              <p className="max-w-2xl mx-auto mb-8 text-lg text-primary-foreground/80">
                {giftingContent.subtitle || "Find the perfect expression of your affection. Our handcrafted pieces make for unforgettable gifts that will be treasured forever."}
              </p>
              <Button asChild size="lg" variant="secondary" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/shop">
                  Explore Gift Ideas
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            {getContent(pageContent, 'blog').title || "From Our Journal"}
          </h2>
           <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent>
              {recentPosts.map((post) => (
                <CarouselItem key={post.id} className="md:basis-1/2 lg:basis-1/3 p-4">
                  <BlogPostCard post={post} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
          <div className="text-center mt-12">
             <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Link href="/blog">
                Read More Stories
              </Link>
            </Button>
          </div>
        </div>
      </section>

       <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="bg-secondary p-10 rounded-lg shadow-lg text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-4">{newsletterContent.title || "Join Our World"}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              {newsletterContent.subtitle || "Subscribe to our newsletter for exclusive updates, new arrivals, and special offers delivered right to your inbox."}
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input type="email" placeholder="Your email address" className="text-base" />
              <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
