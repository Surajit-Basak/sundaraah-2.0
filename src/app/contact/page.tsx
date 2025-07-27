
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";
import { getPageContent, getPageSeo } from "@/lib/data";
import type { PageContent } from "@/types";

export async function generateMetadata() {
  const seoData = await getPageSeo("contact");
  return {
    title: seoData?.seo_title || "Contact Us | Sundaraah Showcase",
    description: seoData?.meta_description || "Get in touch with us for inquiries, custom orders, or just to say hello.",
  };
}

const getContent = (sections: PageContent[], sectionName: string) => {
  return sections.find(s => s.section === sectionName)?.content || {};
};


export default async function ContactPage() {
  const pageContent = await getPageContent("contact");
  const heroContent = getContent(pageContent, 'hero');
  const infoContent = getContent(pageContent, 'info');
  const formContent = getContent(pageContent, 'form');

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center text-center text-primary-foreground">
        <div className="absolute inset-0 bg-primary/80 z-10" />
        <Image
          src="https://placehold.co/1800x600.png"
          alt="Contact Sundaraah"
          data-ai-hint="customer service"
          fill
          className="object-cover"
        />
        <div className="relative z-20 container mx-auto px-4">
          <h1 className="font-headline text-4xl md:text-6xl font-bold drop-shadow-md">
            {heroContent.title || "Get In Touch"}
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mt-4">
            {heroContent.subtitle || "We'd love to hear from you."}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
               <div>
                 <h2 className="font-headline text-2xl md:text-3xl font-bold text-primary mb-6">{infoContent.title || "Contact Information"}</h2>
                 <p className="text-lg text-muted-foreground mb-6">
                    {infoContent.text || "Whether you have a question about our products, a custom design idea, or anything else, our team is ready to answer all your questions."}
                 </p>
                <div className="space-y-4 text-lg">
                  <div className="flex items-center gap-4">
                    <Mail className="h-6 w-6 text-accent" />
                    <a href="mailto:hello@sundaraah.com" className="hover:text-accent">hello@sundaraah.com</a>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="h-6 w-6 text-accent" />
                    <a href="tel:+1234567890" className="hover:text-accent">+1 (234) 567-890</a>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-accent mt-1" />
                    <span>123 Elegance St, Jewel City, 45678</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="font-headline text-2xl md:text-3xl font-bold text-primary mb-6">{formContent.title || "Send Us a Message"}</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="font-headline">First Name</Label>
                    <Input id="firstName" type="text" placeholder="Your first name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="font-headline">Last Name</Label>
                    <Input id="lastName" type="text" placeholder="Your last name" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-headline">Email Address</Label>
                  <Input id="email" type="email" placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="font-headline">Message</Label>
                  <Textarea id="message" placeholder="Your message..." rows={6} />
                </div>
                <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
