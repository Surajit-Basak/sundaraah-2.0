import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Gem, HandHeart, Sparkles } from "lucide-react";
import ProductCard from "@/components/product-card";
import BlogPostCard from "@/components/blog-post-card";
import { getProducts, getBlogPosts } from "@/lib/data";
import TestimonialCard from "@/components/testimonial-card";

export default function Home() {
  const featuredProducts = getProducts().slice(0, 3);
  const recentPosts = getBlogPosts().slice(0, 3);
  const categories = [
    { name: "Necklaces", href: "/shop", imageUrl: "https://placehold.co/400x500.png", hint: "necklace jewelry" },
    { name: "Earrings", href: "/shop", imageUrl: "https://placehold.co/400x500.png", hint: "earrings jewelry" },
    { name: "Bracelets", href: "/shop", imageUrl: "https://placehold.co/400x500.png", hint: "bracelet jewelry" },
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {categories.map((category) => (
              <Link href={category.href} key={category.name} className="group relative overflow-hidden rounded-lg shadow-lg">
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
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            Words from Our Customers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            From Our Journal
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
          <div className="text-center mt-12">
             <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Link href="/blog">
                Read More Stories
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
