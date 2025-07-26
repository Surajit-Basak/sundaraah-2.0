import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

type TestimonialCardProps = {
  quote: string;
  author: string;
};

export default function TestimonialCard({ quote, author }: TestimonialCardProps) {
  return (
    <Card className="bg-background border-none shadow-lg h-full flex flex-col">
      <CardContent className="p-6 flex-grow flex flex-col items-center text-center">
        <Quote className="w-8 h-8 text-accent mb-4" />
        <p className="text-muted-foreground italic mb-4 flex-grow">"{quote}"</p>
        <p className="font-semibold text-primary font-headline">- {author}</p>
      </CardContent>
    </Card>
  );
}
