
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
import type { EmailTemplate } from "@/types";
import { updateEmailTemplate } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";

const emailTemplateSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  body: z.string().min(20, "Body must be at least 20 characters."),
  is_active: z.boolean().default(true),
});

type EmailTemplateFormValues = z.infer<typeof emailTemplateSchema>;

interface EmailTemplateFormProps {
  initialData: EmailTemplate;
}

export function EmailTemplateForm({ initialData }: EmailTemplateFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<EmailTemplateFormValues>({
    resolver: zodResolver(emailTemplateSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: EmailTemplateFormValues) => {
    try {
      await updateEmailTemplate(initialData.id, data);
      toast({
        title: "Success!",
        description: "Email template has been updated.",
      });
      router.push("/admin/emails");
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
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Subject</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Your order has shipped!" {...field} />
              </FormControl>
               <FormDescription>
                Available variables: <code>{{site_name}}</code>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
         <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Body (HTML)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="<p>Hi {{customer_name}},</p><p>Great news! Your order ({{order_id}}) has shipped.</p>"
                  rows={15}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Available variables: <code>{{customer_name}}</code>, <code>{{order_id}}</code>, <code>{{order_url}}</code>, <code>{{site_name}}</code>
              </FormDescription>
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
                    <FormDescription>
                        If disabled, this email will not be sent automatically.
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
        
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
