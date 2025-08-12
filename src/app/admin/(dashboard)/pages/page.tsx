
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PagesDashboard() {
  const pages = [
    { name: "Home", path: "home", description: "Edit content sections for the main landing page." },
    { name: "About", path: "about", description: "Manage the hero, mission, and team sections." },
    { name: "Contact", path: "contact", description: "Update contact info, form titles, and map." },
    { name: "Shop", path: "shop", description: "Change the title and subtitle of the shop page." },
    { name: "Blog", path: "blog", description: "Modify the main title for the blog listing page." },
    { name: "Privacy Policy", path: "privacy", description: "Edit your privacy policy document." },
    { name: "Shipping Policy", path: "shipping", description: "Edit your shipping policy document." },
    { name: "Return Policy", path: "returns", description: "Edit your return and refund policy." },
  ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Page Content Management</h2>
      </div>
      <p className="text-muted-foreground">
        Select a page below to edit its content. Changes made here will be reflected across your live website.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => (
          <Card key={page.path}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {page.name}
              </CardTitle>
              <CardDescription>{page.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href={`/admin/pages/${page.path}`}>
                  Edit Page <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
