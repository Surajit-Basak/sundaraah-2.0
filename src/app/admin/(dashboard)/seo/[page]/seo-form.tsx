
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { updatePageSeo } from "@/lib/data";
import { useRouter } from "next/navigation";
import type { PageSeo } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface SeoFormProps {
  pageData: PageSeo;
}

const formSchema = z.object({
  seo_title: z.string().max(70, "Title should be 70 characters or less.").optional(),
  meta_description: z.string().max(160, "Description should be 160 characters or less.").optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function SeoForm({ pageData }: SeoFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      seo_title: pageData.seo_title || "",
      meta_description: pageData.meta_description || "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await updatePageSeo(pageData.page_identifier, data);
      toast({
        title: "Success!",
        description: `SEO settings for ${pageData.page_identifier} page have been updated.`,
      });
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem saving your SEO settings.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Engine Listing Preview</CardTitle>
        <CardDescription>This is how this page might appear in search results.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="seo_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SEO Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Your page title for search engines" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormDescription>
                    Aim for 50-60 characters. This appears as the main title in a search result.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="meta_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A compelling summary of the page content." {...field} value={field.value || ''} />
                  </FormControl>
                   <FormDescription>
                    Aim for 150-160 characters. This is the descriptive text below the title in a search result.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : "Save SEO Changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
