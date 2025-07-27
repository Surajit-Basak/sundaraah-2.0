
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SeoDashboard() {
  const pages = [
    { name: "Home", path: "home", description: "Manage SEO for the main landing page." },
    { name: "About", path: "about", description: "Optimize the title and description for the about page." },
    { name: "Contact", path: "contact", description: "Set the SEO details for your contact page." },
    { name: "Shop", path: "shop", description: "Control how your main shop page appears in search." },
    { name: "Blog", path: "blog", description: "Manage the SEO for the blog listing page." },
    { name: "Privacy Policy", path: "privacy", description: "Edit SEO for your privacy policy." },
    { name: "Shipping Policy", path: "shipping", description: "Edit SEO for your shipping policy." },
    { name: "Return Policy", path: "returns", description: "Edit SEO for your return and refund policy." },
  ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">SEO Management</h2>
      </div>
      <p className="text-muted-foreground">
        Select a page below to edit its SEO title and meta description. This information helps search engines understand and rank your content.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => (
          <Card key={page.path}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                {page.name}
              </CardTitle>
              <CardDescription>{page.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href={`/admin/seo/${page.path}`}>
                  Edit SEO <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
