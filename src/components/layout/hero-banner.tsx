
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { getBanners } from "@/lib/data";
import type { Banner } from "@/types";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function HeroBanner() {
  const banners: Banner[] = await getBanners();

  if (banners.length === 0) {
    return (
      <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center text-center text-primary-foreground overflow-hidden bg-secondary">
         <div className="relative z-20 container mx-auto px-4 text-primary">
            <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold mb-4 drop-shadow-md">
                Welcome to Our Store
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-primary/80">
                Please add a banner in the admin panel to display it here.
            </p>
            <Button asChild size="lg">
                <Link href="/admin/banners">
                    Go to Admin
                </Link>
            </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden">
      <Carousel
        opts={{
          loop: true,
        }}
        className="h-full"
      >
        <CarouselContent className="h-full">
          {banners.map((banner) => (
            <CarouselItem key={banner.id} className="h-full">
              <div className="relative h-full w-full flex items-center justify-center text-center text-primary-foreground">
                <div className="absolute inset-0 bg-primary/80 z-10" />
                <Image
                  src={banner.image_url}
                  alt={banner.title}
                  data-ai-hint="elegant jewelry"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="relative z-20 container mx-auto px-4">
                  <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold mb-4 drop-shadow-md">
                    {banner.title}
                  </h1>
                  {banner.subtitle && (
                    <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
                      {banner.subtitle}
                    </p>
                  )}
                  {banner.link_href && banner.link_text && (
                    <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                      <Link href={banner.link_href}>
                        {banner.link_text} <ArrowRight className="ml-2" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
