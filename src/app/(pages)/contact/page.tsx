import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";

export const metadata = {
  title: "Contact Us | Sundaraah Showcase",
  description: "Get in touch with us for inquiries, custom orders, or just to say hello.",
};

export default function ContactPage() {
  return (
    <div className="bg-background">
      {/* Header Section */}
      <section className="bg-secondary py-16 md:py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Get In Touch</h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            We'd love to hear from you. Whether you have a question about our products, a custom design idea, or anything else, our team is ready to answer all your questions.
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
                <h2 className="font-headline text-2xl md:text-3xl font-bold text-primary mb-6">Contact Information</h2>
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
              <h2 className="font-headline text-2xl md:text-3xl font-bold text-primary mb-6">Send Us a Message</h2>
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
