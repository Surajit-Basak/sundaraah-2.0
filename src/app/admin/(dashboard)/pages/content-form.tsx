
"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useToast } from "@/hooks/use-toast";
import { updatePageContent } from "@/lib/data";
import { useRouter } from "next/navigation";
import type { PageContent } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MediaPicker } from "@/components/ui/media-picker";


interface ContentFormProps {
  pageName: string;
  sections: PageContent[];
}

// Dynamically create a Zod schema from the sections data
const createSchema = (sections: PageContent[]) => {
  const schemaShape = sections.reduce((acc, section) => {
    const fields = Object.keys(section.content || {}).reduce((fieldAcc, key) => {
      fieldAcc[key] = z.string().optional();
      return fieldAcc;
    }, {} as Record<string, z.ZodOptional<z.ZodString>>);
    acc[section.section] = z.object(fields);
    return acc;
  }, {} as Record<string, z.ZodObject<any>>);
  return z.object(schemaShape);
};

export function ContentForm({ pageName, sections }: ContentFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const formSchema = createSchema(sections);
  type FormValues = z.infer<typeof formSchema>;

  const defaultValues = sections.reduce((acc, section) => {
    acc[section.section] = section.content || {};
    return acc;
  }, {} as any);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: FormValues) => {
    try {
      for (const [sectionName, content] of Object.entries(data)) {
        await updatePageContent(pageName, sectionName, content);
      }
      toast({
        title: "Success!",
        description: `Content for ${pageName} page has been updated.`,
      });
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem saving your content.",
      });
    }
  };
  
  const renderField = (fieldName: string, field: any) => {
    if (fieldName.endsWith('_url') || fieldName.endsWith('_image')) {
      return <MediaPicker {...field} />;
    }
    if (fieldName.includes('paragraph') || fieldName === 'content' || fieldName === 'text' || fieldName === 'html') {
        return <Textarea placeholder={`Enter content for ${fieldName}...`} {...field} rows={fieldName === 'content' || fieldName === 'html' ? 15 : 5} />;
    }
    return <Input placeholder={`Enter content for ${fieldName}...`} {...field} />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {sections.map((section, index) => (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle className="capitalize">{section.section.replace(/_/g, ' ')}</CardTitle>
              <CardDescription>Edit the content for this section.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.keys(section.content || {}).map((key) => (
                <FormField
                  key={`${section.section}.${key}`}
                  control={form.control}
                  name={`${section.section}.${key}` as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize">{key.replace(/_/g, ' ')}</FormLabel>
                      <FormControl>
                        {renderField(key, field)}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </CardContent>
          </Card>
        ))}

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
