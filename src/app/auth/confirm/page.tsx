
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MailCheck } from "lucide-react";
import Link from "next/link";

export default function AuthConfirmPage() {
  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center">
            <MailCheck className="w-16 h-16 text-green-500 mb-4" />
          </div>
          <CardTitle className="text-2xl">Confirm your email</CardTitle>
          <CardDescription>
            We've sent a confirmation link to your email address. Please check your inbox and click the link to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
