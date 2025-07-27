
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
import { Switch } from "@/components/ui/switch";
import type { Testimonial } from "@/types";
import { createTestimonial, updateTestimonial } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const testimonialSchema = z.object({
  quote: z.string().min(10, "Quote must be at least 10 characters."),
  author: z.string().min(2, "Author's name must be at least 2 characters."),
  is_active: z.boolean().default(true),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

interface TestimonialFormProps {
  initialData?: Testimonial | null;
}

export function TestimonialForm({ initialData }: TestimonialFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: initialData || {
      quote: "",
      author: "",
      is_active: true,
    },
  });

  const onSubmit = async (data: TestimonialFormValues) => {
    try {
      if (initialData) {
        await updateTestimonial(initialData.id, data);
        toast({
          title: "Success!",
          description: "Testimonial has been updated.",
        });
      } else {
        await createTestimonial(data);
        toast({
            title: "Success!",
            description: "Testimonial has been created.",
        });
      }
      
      router.push("/admin/testimonials");
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
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Priya K." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quote"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quote</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="The full testimonial quote..."
                  rows={5}
                  {...field}
                />
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
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : (initialData ? "Save changes" : "Create Testimonial")}
        </Button>
      </form>
    </Form>
  );
}
