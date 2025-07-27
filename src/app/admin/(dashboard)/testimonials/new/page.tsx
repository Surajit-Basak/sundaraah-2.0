
import { TestimonialForm } from "@/app/admin/(dashboard)/testimonials/testimonial-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewTestimonialPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Testimonial</CardTitle>
        </CardHeader>
        <CardContent>
          <TestimonialForm />
        </CardContent>
      </Card>
    </div>
  );
}
