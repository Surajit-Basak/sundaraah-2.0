
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
import { MediaPicker } from "@/components/ui/media-picker";
import { hexToHsl, isHexColor } from "@/lib/utils";

const colorSchema = z.string().refine(value => {
    const isHsl = /^hsl\(\d{1,3} \d{1,3}% \d{1,3}%\)$/.test(value);
    return isHsl || isHexColor(value);
}, { message: "Must be a valid HSL or Hex color string (e.g., hsl(30 50% 98%) or #fdfa_f7)" });

const settingsSchema = z.object({
  site_name: z.string().min(2, "Site name must be at least 2 characters."),
  logo_url: z.string().optional(),
  theme_colors: z.object({
    primary: colorSchema,
    background: colorSchema,
    accent: colorSchema,
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
      logo_url: "",
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
      // Convert any hex colors to HSL before saving
      const processedColors = {
        primary: isHexColor(data.theme_colors.primary) ? hexToHsl(data.theme_colors.primary) : data.theme_colors.primary,
        background: isHexColor(data.theme_colors.background) ? hexToHsl(data.theme_colors.background) : data.theme_colors.background,
        accent: isHexColor(data.theme_colors.accent) ? hexToHsl(data.theme_colors.accent) : data.theme_colors.accent,
      };

      await updateSettings({
        ...data,
        theme_colors: processedColors,
      });

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
            <CardContent className="space-y-6">
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
                        The name of your website, displayed if no logo is selected.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="logo_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Logo</FormLabel>
                      <FormControl>
                        <MediaPicker {...field} />
                      </FormControl>
                       <FormDescription>
                        Upload a logo to the Media Library, then select it here. Recommended size: 200x50 pixels.
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
                    Define the main colors for your website. Use HSL (e.g., `hsl(347 65% 25%)`) or Hex (e.g., `#5d1d39`).
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
