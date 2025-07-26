
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Gem, HandHeart, Sparkles } from "lucide-react";
import ProductCard from "@/components/product-card";
import BlogPostCard from "@/components/blog-post-card";
import { getProducts, getBlogPosts, getTeamMembers } from "@/lib/data";
import TestimonialCard from "@/components/testimonial-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Input } from "@/components/ui/input";

export default function Home() {
  const allProducts = getProducts();
  const featuredProducts = allProducts.slice(0, 6);
  const trendingProducts = allProducts.slice(3, 9).sort(() => 0.5 - Math.random());
  const bestSellers = allProducts.slice(1, 7).sort(() => 0.5 - Math.random());
  const recentPosts = getBlogPosts();
  const mainArtisan = getTeamMembers()[1]; // Rohan Verma, Master Artisan
  const categories = [
    { name: "Necklaces", href: "/shop", imageUrl: "https://placehold.co/400x500.png", hint: "necklace jewelry" },
    { name: "Earrings", href: "/shop", imageUrl: "https://placehold.co/400x500.png", hint: "earrings jewelry" },
    { name: "Bracelets", href: "/shop", imageUrl: "https://placehold.co/400x500.png", hint: "bracelet jewelry" },
    { name: "Rings", href: "/shop", imageUrl: "https://placehold.co/400x500.png", hint: "ring jewelry" },
    { name: "Anklets", href: "/shop", imageUrl: "https://placehold.co/400x500.png", hint: "anklet jewelry" },

  ];
  const testimonials = [
    {
      quote: "The necklace I bought is absolutely stunning. The craftsmanship is top-notch, and I get compliments every time I wear it!",
      author: "Priya K.",
    },
    {
      quote: "Sundaraah's customer service is as wonderful as their jewelry. They helped me pick the perfect gift, and it was a huge hit.",
      author: "Rahul S.",
    },
    {
      quote: "I'm in love with my new earrings. They are elegant, unique, and beautifully made. I'll definitely be coming back for more.",
      author: "Anjali M.",
    },
     {
      quote: "The quality is exceptional. You can feel the love and dedication that goes into each piece. A truly special brand.",
      author: "Sameer T.",
    },
    {
      quote: "My bracelet is my new favorite accessory. It's so versatile and beautifully crafted. I'll be a returning customer for sure.",
      author: "Divya R.",
    },
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

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center text-center text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-primary/80 z-10" />
        <Image
          src="https://placehold.co/1800x1200.png"
          alt="Handcrafted jewelry"
          data-ai-hint="elegant jewelry"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 container mx-auto px-4">
          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold mb-4 drop-shadow-md">
            Elegance in Every Detail
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Discover our exclusive collection of handcrafted jewelry, designed to make every moment special.
          </p>
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/shop">
              Shop Now <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Why Choose Us Section */}
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

      {/* Featured Products Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            Featured Collection
          </h2>
           <Carousel opts={{ align: "start", loop: true }}>
            <CarouselContent>
              {featuredProducts.map((product) => (
                <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 p-4">
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Link href="/shop">
                View All Products
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Shop by Category Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            Shop by Category
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

      {/* Trending Products Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            Trending Now
          </h2>
           <Carousel opts={{ align: "start", loop: true }}>
            <CarouselContent>
              {trendingProducts.map((product) => (
                <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 p-4">
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>

      {/* Our Craftsmanship Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="prose prose-lg max-w-none text-foreground">
              <h2 className="font-headline text-3xl md:text-4xl text-primary mb-4">The Soul of Sundaraah</h2>
              <p>
                Behind every piece of Sundaraah jewelry lies a story of tradition, skill, and dedication. Our master artisans, like {mainArtisan.name}, pour their hearts into crafting each item, ensuring it's not just an accessory, but a work of art.
              </p>
              <p>
                We believe in the beauty of the human touch. From the initial sketch to the final polish, every step is a testament to our commitment to exceptional craftsmanship and timeless design.
              </p>
              <Button asChild variant="link" className="text-accent p-0 mt-4 text-lg">
                <Link href="/about">
                  Meet Our Artisans <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="aspect-square relative">
              <Image
                src="https://placehold.co/600x600.png"
                alt="Artisan at work"
                data-ai-hint="artisan jewelry"
                width={600}
                height={600}
                className="rounded-lg shadow-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Best Sellers Section */}
       <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            Our Best Sellers
          </h2>
           <Carousel opts={{ align: "start", loop: true }}>
            <CarouselContent>
              {bestSellers.map((product) => (
                <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 p-4">
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            Words from Our Customers
          </h2>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-4">
                   <TestimonialCard {...testimonial} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>

       {/* Gifting Banner Section */}
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
              <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">The Art of Gifting</h2>
              <p className="max-w-2xl mx-auto mb-8 text-lg text-primary-foreground/80">
                Find the perfect expression of your affection. Our handcrafted pieces make for unforgettable gifts that will be treasured forever.
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

      {/* Blog Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            From Our Journal
          </h2>
           <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
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

       {/* Newsletter Section */}
       <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="bg-secondary p-10 rounded-lg shadow-lg text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-4">Join Our World</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Subscribe to our newsletter for exclusive updates, new arrivals, and special offers delivered right to your inbox.
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
