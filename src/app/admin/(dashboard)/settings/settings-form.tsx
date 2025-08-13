
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MediaPicker } from "@/components/ui/media-picker";
import { hexToHsl, isHexColor } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const colorSchema = z.string().refine(value => {
    const isHsl = /^hsl\(\d{1,3} \d{1,3}% \d{1,3}%\)$/.test(value);
    return isHsl || isHexColor(value);
}, { message: "Must be a valid HSL or Hex color string (e.g., hsl(30 50% 98%) or #fdfaf7)" });

const settingsSchema = z.object({
  site_name: z.string().min(2, "Site name must be at least 2 characters."),
  header_logo_url: z.string().optional(),
  footer_logo_url: z.string().optional(),
  favicon_url: z.string().optional(),
  copyright_text: z.string().optional(),
  theme_colors: z.object({
    primary: colorSchema,
    background: colorSchema,
    accent: colorSchema,
  }),
  theme_fonts: z.object({
      body: z.string(),
      headline: z.string(),
  }),
  whatsapp_number: z.string().optional(),
  whatsapp_enabled: z.boolean().default(true),
  shipping_fee: z.coerce.number().min(0, "Shipping fee must be a positive number.").default(0),
  free_shipping_threshold: z.coerce.number().min(0, "Threshold must be a positive number.").default(1000),
  preloader_enabled: z.boolean().default(true),
  social_twitter_url: z.string().optional(),
  social_twitter_enabled: z.boolean().default(true),
  social_facebook_url: z.string().optional(),
  social_facebook_enabled: z.boolean().default(true),
  social_instagram_url: z.string().optional(),
  social_instagram_enabled: z.boolean().default(true),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

interface SettingsFormProps {
  initialData?: Settings | null;
}

const availableFonts = [
    { name: "Inter", value: "Inter" },
    { name: "Lato", value: "Lato" },
    { name: "Merriweather", value: "Merriweather" },
    { name: "Montserrat", value: "Montserrat" },
    { name: "Open Sans", value: "Open Sans" },
    { name: "Playfair Display", value: "Playfair Display" },
    { name: "Poppins", value: "Poppins" },
    { name: "PT Sans", value: "PT Sans" },
    { name: "Roboto", value: "Roboto" },
    { name: "Source Sans Pro", value: "Source Sans Pro" },
];


export function SettingsForm({ initialData }: SettingsFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initialData || {
      site_name: "Sundaraah Showcase",
      header_logo_url: "",
      footer_logo_url: "",
      favicon_url: "",
      copyright_text: "",
      theme_colors: {
        primary: "hsl(347 65% 25%)",
        background: "hsl(30 50% 98%)",
        accent: "hsl(45 85% 55%)",
      },
      theme_fonts: {
          body: "PT Sans",
          headline: "Playfair Display",
      },
      whatsapp_number: "",
      whatsapp_enabled: true,
      shipping_fee: 50,
      free_shipping_threshold: 500,
      preloader_enabled: true,
      social_twitter_url: "#",
      social_twitter_enabled: true,
      social_facebook_url: "#",
      social_facebook_enabled: true,
      social_instagram_url: "#",
      social_instagram_enabled: true,
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
      
      // Full page reload to apply new theme and fonts
      window.location.reload();

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
                  name="header_logo_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Header Logo</FormLabel>
                      <FormControl>
                        <MediaPicker {...field} />
                      </FormControl>
                       <FormDescription>
                        Displayed in the site header. For best results, upload a transparent PNG at least 600px wide.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="footer_logo_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Footer Logo</FormLabel>
                      <FormControl>
                        <MediaPicker {...field} />
                      </FormControl>
                       <FormDescription>
                        A separate logo for the site footer. If empty, the site name will be used. Recommended minimum width: 600px.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="favicon_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Favicon</FormLabel>
                      <FormControl>
                        <MediaPicker {...field} />
                      </FormControl>
                       <FormDescription>
                        The icon displayed in the browser tab. Recommended size: 32x32px or 64x64px.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="copyright_text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Copyright Text</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="© 2024 Your Company. All Rights Reserved."
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                       <FormDescription>
                        The copyright text displayed in the site footer.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Theme Colors & Fonts</CardTitle>
                <CardDescription>
                    Define the main colors and typography for your website.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="theme_colors.primary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Color</FormLabel>
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
                          <FormLabel>Accent Color</FormLabel>
                          <FormControl>
                            <Input placeholder="hsl(45 85% 55%)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <FormField
                      control={form.control}
                      name="theme_fonts.headline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Headline Font</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a font for headlines" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableFonts.map((font) => (
                                <SelectItem key={font.value} value={font.value}>
                                  {font.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="theme_fonts.body"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Body Font</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a font for body text" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableFonts.map((font) => (
                                <SelectItem key={font.value} value={font.value}>
                                  {font.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Shipping</CardTitle>
                 <CardDescription>
                    Manage shipping fees for your store.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <FormField
                      control={form.control}
                      name="shipping_fee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shipping Fee (INR)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="50" {...field} />
                          </FormControl>
                          <FormDescription>
                            This is the flat rate shipping fee applied to orders.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="free_shipping_threshold"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Free Shipping Threshold (INR)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="500" {...field} />
                          </FormControl>
                           <FormDescription>
                            Orders with a subtotal above this amount get free shipping.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
            </CardContent>
        </Card>
        
        <Card>
             <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>
                    Manage the social media icons and links in your site's footer.
                </CardDescription>
             </CardHeader>
             <CardContent className="space-y-6">
                {/* Twitter */}
                <div className="flex items-end gap-4">
                    <FormField
                      control={form.control}
                      name="social_twitter_url"
                      render={({ field }) => (
                        <FormItem className="flex-grow">
                          <FormLabel>Twitter URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://twitter.com/yourprofile" {...field} value={field.value || ''} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="social_twitter_enabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-center gap-2">
                           <FormLabel>Enabled</FormLabel>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                </div>
                 {/* Facebook */}
                <div className="flex items-end gap-4">
                    <FormField
                      control={form.control}
                      name="social_facebook_url"
                      render={({ field }) => (
                        <FormItem className="flex-grow">
                          <FormLabel>Facebook URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://facebook.com/yourprofile" {...field} value={field.value || ''} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="social_facebook_enabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-center gap-2">
                           <FormLabel>Enabled</FormLabel>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                </div>
                 {/* Instagram */}
                <div className="flex items-end gap-4">
                    <FormField
                      control={form.control}
                      name="social_instagram_url"
                      render={({ field }) => (
                        <FormItem className="flex-grow">
                          <FormLabel>Instagram URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://instagram.com/yourprofile" {...field} value={field.value || ''} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="social_instagram_enabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-center gap-2">
                           <FormLabel>Enabled</FormLabel>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                </div>
             </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
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
                <Separator />
                <FormField
                  control={form.control}
                  name="preloader_enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Enable Frontend Preloader
                        </FormLabel>
                        <FormDescription>
                          Show a loading animation with your logo before the page content appears.
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
