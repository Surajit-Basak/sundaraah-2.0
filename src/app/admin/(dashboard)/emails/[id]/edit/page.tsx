
import { getEmailTemplateById } from "@/lib/data";
import { notFound } from "next/navigation";
import { EmailTemplateForm } from "@/app/admin/(dashboard)/emails/email-template-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function EditEmailTemplatePage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
      notFound();
  }
  
  const template = await getEmailTemplateById(id);

  if (!template) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
        <Button asChild variant="outline" className="mb-4">
            <Link href="/admin/emails">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Templates
            </Link>
        </Button>
      <Card>
        <CardHeader>
          <CardTitle>Edit: {template.name}</CardTitle>
          <CardDescription>
            Triggered by event: <code>{template.event_trigger}</code>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmailTemplateForm initialData={template} />
        </CardContent>
      </Card>
    </div>
  );
}
