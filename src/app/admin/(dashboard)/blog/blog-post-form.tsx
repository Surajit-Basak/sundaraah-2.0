
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { BlogPost } from "@/types";
import { createBlogPost, updateBlogPost } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const blogPostSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters."),
  content: z.string().min(20, "Content must be at least 20 characters."),
});

type BlogPostFormValues = z.infer<typeof blogPostSchema>;

interface BlogPostFormProps {
  initialData?: BlogPost | null;
}

export function BlogPostForm({ initialData }: BlogPostFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: initialData || {
      title: "",
      excerpt: "",
      content: "",
    },
  });

  const onSubmit = async (data: BlogPostFormValues) => {
    try {
        const postData = {
            ...data,
            slug: data.title.toLowerCase().replace(/\s+/g, '-'),
            date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        };

      if (initialData) {
        await updateBlogPost(initialData.id, postData);
        toast({
          title: "Success!",
          description: "Blog post has been updated.",
        });
      } else {
        await createBlogPost({
            ...postData,
            image_url: 'https://placehold.co/400x250.png',
        });
        toast({
            title: "Success!",
            description: "Blog post has been created.",
        });
      }
      
      router.push("/admin/blog");
      router.refresh();

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Post Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., The Art of Handcrafted Jewelry" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A short summary of the blog post..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Content (Markdown supported)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your full blog post here..."
                  rows={15}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : (initialData ? "Save changes" : "Create Post")}
        </Button>
      </form>
    </Form>
  );
}
