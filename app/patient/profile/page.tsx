"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@/lib/zod-resolver";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { patientProfileSchema, type PatientProfileValues } from "@/lib/validations/profile";
import { usePatient, usePatientByUserId, useUpdatePatient } from "@/hooks/use-patients";
import { useAuth } from "@/contexts/auth-context";
import { ChangePasswordCard } from "@/components/auth/change-password-card";

export default function PatientProfilePage() {
  const { user } = useAuth();
  const { data: patient } = usePatientByUserId(user?.id ?? "");
  const updatePatient = useUpdatePatient();

  const form = useForm<PatientProfileValues, unknown, PatientProfileValues>({
    resolver: zodResolver(patientProfileSchema),
    defaultValues: { name: "", phone: "", gender: "OTHER", dateOfBirth: "", address: "" },
  });

  useEffect(() => {
    if (patient) {
      form.reset({
        name: patient.name,
        phone: patient.phone,
        gender: patient.gender,
        dateOfBirth: patient.dateOfBirth,
        address: patient.address,
      });
    }
  }, [patient, form]);

  function onSubmit(values: PatientProfileValues) {
    if (!patient) return;
    updatePatient.mutate(
      {
        id: patient.id,
        input: {
          name: values.name,
          phone: values.phone,
          gender: values.gender,
          dateOfBirth: values.dateOfBirth ?? "",
          address: values.address ?? "",
        },
      },
      { onSuccess: () => toast.success("Profile updated") },
    );
  }

  return (
    <div className="space-y-6">
      <Card className="max-w-2xl border-border/70">
        <CardHeader>
          <CardTitle className="text-lg">My profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" inputMode="tel" placeholder="0803 123 4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea rows={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={updatePatient.isPending}>
                Save changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <ChangePasswordCard />
    </div>
  );
}
