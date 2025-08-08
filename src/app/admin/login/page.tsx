
"use client";

import { adminLogin } from '@/app/auth/actions';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Gem } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getSettings } from '@/lib/data';
import type { Settings } from '@/types';

export default function AdminLoginPage() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  const siteName = settings?.site_name || "Sundaraah";

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4 h-12">
               {settings?.header_logo_url ? (
                  <Image src={settings.header_logo_url} alt={`${siteName} logo`} width={240} height={60} className="object-contain max-h-full w-auto" />
                ) : (
                  <>
                    <Gem className="h-8 w-8 text-accent"/>
                    <h3 className="font-headline text-3xl font-bold text-primary">{siteName}</h3>
                  </>
                )}
            </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" name="password" required />
              </div>
              <Button formAction={adminLogin} className="w-full">
                Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
