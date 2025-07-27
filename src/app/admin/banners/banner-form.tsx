
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
import type { Banner } from "@/types";
import { createBanner, updateBanner } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";

const bannerSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  subtitle: z.string().optional(),
  link_href: z.string().optional(),
  link_text: z.string().optional(),
  sort_order: z.coerce.number().default(0),
  is_active: z.boolean().default(true),
});

type BannerFormValues = z.infer<typeof bannerSchema>;

interface BannerFormProps {
  initialData?: Banner | null;
}

export function BannerForm({ initialData }: BannerFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
    defaultValues: initialData || {
      title: "",
      subtitle: "",
      link_href: "",
      link_text: "",
      sort_order: 0,
      is_active: true,
    },
  });

  const onSubmit = async (data: BannerFormValues) => {
    try {
      if (initialData) {
        await updateBanner(initialData.id, data);
        toast({
          title: "Success!",
          description: "Banner has been updated.",
        });
      } else {
        await createBanner({
            ...data,
            image_url: 'https://placehold.co/1800x1200.png',
        });
        toast({
            title: "Success!",
            description: "Banner has been created.",
        });
      }
      
      router.push("/admin/banners");
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
              <FormLabel>Banner Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Elegance in Every Detail" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtitle (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A short, catchy subtitle for the banner..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="link_href"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link URL (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="/shop" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="link_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link Button Text (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Shop Now" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="sort_order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sort Order</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Active
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
        </div>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : (initialData ? "Save changes" : "Create Banner")}
        </Button>
      </form>
    </Form>
  );
}
