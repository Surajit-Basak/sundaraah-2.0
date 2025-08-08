import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTeamMembers, getPageContent, getPageSeo } from "@/lib/data";
import type { TeamMember, PageContent } from "@/types";

export async function generateMetadata() {
  const seoData = await getPageSeo("about");
  return {
    title: seoData?.seo_title || "About Us | Sundaraah Showcase",
    description: seoData?.meta_description || "Learn about the story, passion, and people behind Sundaraah Showcase.",
  };
}

const getContent = (sections: PageContent[], sectionName: string) => {
  return sections.find(s => s.section === sectionName)?.content || {};
};

export default async function AboutPage() {
  const [team, pageContent] = await Promise.all([
      getTeamMembers(),
      getPageContent("about"),
  ]);

  const heroContent = getContent(pageContent, 'hero');
  const missionContent = getContent(pageContent, 'mission');
  const teamContent = getContent(pageContent, 'team');

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center text-center text-primary-foreground">
        <div className="absolute inset-0 bg-primary/80 z-10" />
        <Image
          src={heroContent.image_url || "https://placehold.co/1800x800.png"}
          alt={heroContent.title || "Artisan workshop"}
          data-ai-hint="artisan workshop"
          fill
          className="object-cover"
        />
        <div className="relative z-20 container mx-auto px-4">
          <h1 className="font-headline text-4xl md:text-6xl font-bold drop-shadow-md">
            {heroContent.title || "Our Story"}
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mt-4">
            {heroContent.subtitle || "A journey of passion, craftsmanship, and the love for timeless beauty."}
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="prose prose-lg max-w-none text-foreground">
              <h2 className="font-headline text-3xl md:text-4xl text-primary mb-4">{missionContent.title || "Crafted with Passion"}</h2>
              <p>{missionContent.paragraph1}</p>
              <p>{missionContent.paragraph2}</p>
            </div>
            <div>
              <Image
                src={missionContent.image_url || "https://placehold.co/600x700.png"}
                alt={missionContent.title || "Jewelry making process"}
                data-ai-hint="jewelry making"
                width={600}
                height={700}
                className="rounded-lg shadow-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            {teamContent.title || "Meet the Artisans"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <Card key={member.id} className="text-center border-none shadow-lg transform transition-transform duration-300 hover:scale-105">
                <CardHeader>
                  <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-accent">
                    <Image
                      src={member.imageUrl}
                      alt={member.name}
                      data-ai-hint="portrait professional"
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="font-headline text-xl">{member.name}</CardTitle>
                  <p className="text-accent font-semibold my-1">{member.role}</p>
                  <p className="text-muted-foreground mt-2">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
