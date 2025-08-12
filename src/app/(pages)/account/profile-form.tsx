
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UserProfile, Address } from "@/types";
import { updateUserProfile } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const addressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
});

const profileSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters.").optional(),
  phone: z.string().min(10, "Please enter a valid phone number.").optional(),
  dob: z.string().optional(), // Storing as string, validation for date format can be added
  billing_address: addressSchema.optional(),
  shipping_address: addressSchema.optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  userProfile: UserProfile | null;
}

export function ProfileForm({ userProfile }: ProfileFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: userProfile?.full_name || "",
      phone: userProfile?.phone || "",
      dob: userProfile?.dob ? new Date(userProfile.dob).toISOString().split('T')[0] : "",
      billing_address: userProfile?.billing_address || {},
      shipping_address: userProfile?.shipping_address || {},
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    if (!userProfile) return;

    try {
      await updateUserProfile(userProfile.id, data);
      toast({
        title: "Success!",
        description: "Your profile has been updated.",
      });
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem updating your profile.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
        <CardDescription>Update your personal details and addresses.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input readOnly value={userProfile?.email || ''} className="bg-muted"/>
                  </FormControl>
                   <FormDescription>
                    Your email is used for login and cannot be changed here.
                  </FormDescription>
                </FormItem>
                 <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} value={field.value || ''} placeholder="e.g. 9876543210"/>
                      </FormControl>
                       <FormDescription>
                        Required for shipping updates.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                            <Input type="date" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium">Billing Address</h3>
              <div className="space-y-4 mt-4">
                <FormField control={form.control} name="billing_address.street" render={({ field }) => (<FormItem><FormLabel>Street</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>)} />
                <FormField control={form.control} name="billing_address.city" render={({ field }) => (<FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>)} />
                <FormField control={form.control} name="billing_address.state" render={({ field }) => (<FormItem><FormLabel>State</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>)} />
                <FormField control={form.control} name="billing_address.postal_code" render={({ field }) => (<FormItem><FormLabel>Postal Code</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>)} />
                <FormField control={form.control} name="billing_address.country" render={({ field }) => (<FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>)} />
              </div>
            </div>

            <Separator />
            
             <div>
              <h3 className="text-lg font-medium">Shipping Address</h3>
              <div className="space-y-4 mt-4">
                <FormField control={form.control} name="shipping_address.street" render={({ field }) => (<FormItem><FormLabel>Street</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>)} />
                <FormField control={form.control} name="shipping_address.city" render={({ field }) => (<FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>)} />
                <FormField control={form.control} name="shipping_address.state" render={({ field }) => (<FormItem><FormLabel>State</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>)} />
                <FormField control={form.control} name="shipping_address.postal_code" render={({ field }) => (<FormItem><FormLabel>Postal Code</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>)} />
                <FormField control={form.control} name="shipping_address.country" render={({ field }) => (<FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl></FormItem>)} />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
