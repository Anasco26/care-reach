"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@/lib/zod-resolver";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { doctorProfileSchema, type DoctorProfileValues } from "@/lib/validations/profile";
import { TIME_SLOTS, formatTime } from "@/lib/appointment-utils";
import { cn } from "@/lib/utils";
import { useDoctor, useUpdateDoctor } from "@/hooks/use-doctors";
import { useAuth } from "@/contexts/auth-context";
import { ChangePasswordCard } from "@/components/auth/change-password-card";

export default function DoctorProfilePage() {
  const { user } = useAuth();
  const { data: doctor } = useDoctor(user?.profileId ?? "");
  const updateDoctor = useUpdateDoctor();

  const form = useForm<z.input<typeof doctorProfileSchema>, unknown, DoctorProfileValues>({
    resolver: zodResolver(doctorProfileSchema),
    defaultValues: {
      name: "",
      phone: "",
      experienceYears: 0,
      fee: 0,
      available: true,
      availableSlots: TIME_SLOTS,
      bio: "",
    },
  });

  useEffect(() => {
    if (doctor) {
      form.reset({
        name: doctor.name,
        phone: doctor.phone,
        experienceYears: doctor.experienceYears,
        fee: doctor.fee,
        available: doctor.available,
        availableSlots: doctor.availableSlots.length ? doctor.availableSlots : TIME_SLOTS,
        bio: doctor.bio,
      });
    }
  }, [doctor, form]);

  function onSubmit(values: DoctorProfileValues) {
    if (!doctor) return;
    updateDoctor.mutate(
      { id: doctor.id, input: values },
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
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="experienceYears"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of experience</FormLabel>
                      <FormControl>
                        {(() => {
                          const { value, ...numberField } = field;
                          return (
                            <Input
                              type="number"
                              min={0}
                              {...numberField}
                              value={value as string | number | readonly string[] | undefined}
                            />
                          );
                        })()}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consultation fee (₦)</FormLabel>
                      <FormControl>
                        {(() => {
                          const { value, ...numberField } = field;
                          return (
                            <Input
                              type="number"
                              min={0}
                              {...numberField}
                              value={value as string | number | readonly string[] | undefined}
                            />
                          );
                        })()}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="available"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border border-border p-3">
                    <FormLabel>Accepting new appointments</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availableSlots"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available appointment times</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Patients can only book the slots you select here.
                    </p>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {TIME_SLOTS.map((slot) => {
                        const active = field.value.includes(slot);
                        return (
                          <Button
                            key={slot}
                            type="button"
                            size="sm"
                            variant={active ? "default" : "outline"}
                            onClick={() =>
                              field.onChange(
                                active
                                  ? field.value.filter((s) => s !== slot)
                                  : [...field.value, slot],
                              )
                            }
                            className={cn(!active && "text-muted-foreground")}
                          >
                            {formatTime(slot)}
                          </Button>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={updateDoctor.isPending}>
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
