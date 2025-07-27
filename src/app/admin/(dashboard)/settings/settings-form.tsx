
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
import { Switch } from "@/components/ui/switch";
import type { Settings } from "@/types";
import { updateSettings } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const settingsSchema = z.object({
  site_name: z.string().min(2, "Site name must be at least 2 characters."),
  theme_colors: z.object({
    primary: z.string().regex(/^hsl\(\d{1,3} \d{1,3}% \d{1,3}%\)$/, { message: "Must be a valid HSL color string (e.g., hsl(347 65% 25%))" }),
    background: z.string().regex(/^hsl\(\d{1,3} \d{1,3}% \d{1,3}%\)$/, { message: "Must be a valid HSL color string (e.g., hsl(30 50% 98%))" }),
    accent: z.string().regex(/^hsl\(\d{1,3} \d{1,3}% \d{1,3}%\)$/, { message: "Must be a valid HSL color string (e.g., hsl(45 85% 55%))" }),
  }),
  whatsapp_number: z.string().optional(),
  whatsapp_enabled: z.boolean().default(true),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

interface SettingsFormProps {
  initialData?: Settings | null;
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initialData || {
      site_name: "Sundaraah Showcase",
      theme_colors: {
        primary: "hsl(347 65% 25%)",
        background: "hsl(30 50% 98%)",
        accent: "hsl(45 85% 55%)",
      },
      whatsapp_number: "",
      whatsapp_enabled: true,
    },
  });

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      await updateSettings(data);
      toast({
        title: "Success!",
        description: "Settings have been updated.",
      });
      router.refresh(); // Refresh the page to reflect changes
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem saving your settings.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>Site Identity</CardTitle>
            </CardHeader>
            <CardContent>
                <FormField
                  control={form.control}
                  name="site_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Sundaraah Showcase" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormDescription>
                        The name of your website, displayed in the header and footer.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Theme Colors</CardTitle>
                <FormDescription>
                    Define the main colors for your website. Use HSL format (e.g., `hsl(347 65% 25%)`).
                </FormDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <FormField
                  control={form.control}
                  name="theme_colors.primary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Color (Wine)</FormLabel>
                      <FormControl>
                        <Input placeholder="hsl(347 65% 25%)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="theme_colors.background"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Background Color</FormLabel>
                      <FormControl>
                        <Input placeholder="hsl(30 50% 98%)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="theme_colors.accent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Accent Color (Golden)</FormLabel>
                      <FormControl>
                        <Input placeholder="hsl(45 85% 55%)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Floating Buttons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="whatsapp_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 15551234567" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormDescription>
                        The phone number for the WhatsApp floating button. Include country code without symbols.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="whatsapp_enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Enable WhatsApp Button
                        </FormLabel>
                        <FormDescription>
                          Show or hide the floating WhatsApp chat button on the public site.
                        </FormDescription>
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
            </CardContent>
        </Card>

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
