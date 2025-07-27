
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
import type { Collection } from "@/types";
import { createCollection, updateCollection } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const collectionSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z.string().optional(),
});

type CollectionFormValues = z.infer<typeof collectionSchema>;

interface CollectionFormProps {
  initialData?: Collection | null;
}

export function CollectionForm({ initialData }: CollectionFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: CollectionFormValues) => {
    try {
      const collectionData = {
        ...data,
        slug: data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
      };

      if (initialData) {
        await updateCollection(initialData.id, collectionData);
        toast({
          title: "Success!",
          description: "Collection has been updated.",
        });
      } else {
        await createCollection({
          ...collectionData,
          image_url: 'https://placehold.co/1200x400.png',
        });
        toast({
          title: "Success!",
          description: "Collection has been created.",
        });
      }
      
      router.push("/admin/collections");
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Collection Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Summer Sparkle" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A short description of the collection..."
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : (initialData ? "Save changes" : "Create Collection")}
        </Button>
      </form>
    </Form>
  );
}
