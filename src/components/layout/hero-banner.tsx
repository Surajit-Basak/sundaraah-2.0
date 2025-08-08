
"use client";

import * as React from "react"
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
} from "@/components/ui/carousel";
import type { Banner } from "@/types";
import { ArrowRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay"

export default function HeroBanner({ banners }: { banners: Banner[] }) {

  if (!banners || banners.length === 0) {
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
    <section className="h-[60vh] md:h-[80vh] w-full">
      <Carousel
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        opts={{
          loop: true,
        }}
        className="h-full relative"
      >
        <CarouselContent className="h-full">
          {banners.map((banner) => (
            <CarouselItem key={banner.id} className="h-full">
               <div className="relative h-full w-full">
                    <Image
                        src={banner.image_url}
                        alt={banner.title}
                        data-ai-hint="elegant jewelry"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                    <div className="relative h-full container mx-auto px-4 flex flex-col items-start justify-center text-left text-white">
                        <div className="max-w-xl">
                            <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold mb-4 drop-shadow-md">
                                {banner.title}
                            </h1>
                            {banner.subtitle && (
                            <p className="text-lg md:text-xl mb-8 text-white/90">
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
                </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselDots />
      </Carousel>
    </section>
  );
}
