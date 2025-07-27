
import { getTestimonialById } from "@/lib/data";
import { notFound } from "next/navigation";
import { TestimonialForm } from "@/app/admin/(dashboard)/testimonials/testimonial-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditTestimonialPage({ params }: { params: { id: string } }) {
  const testimonial = await getTestimonialById(params.id);

  if (!testimonial) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Testimonial</CardTitle>
        </CardHeader>
        <CardContent>
          <TestimonialForm initialData={testimonial} />
        </CardContent>
      </Card>
    </div>
  );
}
