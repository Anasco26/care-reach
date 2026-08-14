import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@/lib/zod-resolver";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { doctorSchema, type DoctorValues } from "@/lib/validations/doctor";
import { useCreateDoctor, useSpecializations, useUpdateDoctor } from "@/hooks/use-doctors";

import type { Doctor } from "@/types";

const empty: DoctorValues = {
  name: "",
  email: "",
  phone: "",
  specializationId: "",
  experienceYears: 0,
  fee: 0,
  gender: "FEMALE",
  available: true,
  bio: "",
};

export function DoctorFormDialog({
  open,
  doctor,
  onOpenChange,
}: {
  open: boolean;
  doctor: Doctor | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: specializations = [] } = useSpecializations();
  const createDoctor = useCreateDoctor();
  const updateDoctor = useUpdateDoctor();

  const form = useForm<z.input<typeof doctorSchema>, unknown, DoctorValues>({
    resolver: zodResolver(doctorSchema),
    defaultValues: empty,
  });

  useEffect(() => {
    if (!open) return;
    form.reset(
      doctor
        ? {
            name: doctor.name,
            email: doctor.email,
            phone: doctor.phone,
            specializationId: doctor.specializationId,
            experienceYears: doctor.experienceYears,
            fee: doctor.fee,
            gender: doctor.gender,
            available: doctor.available,
            bio: doctor.bio,
          }
        : empty,
    );
  }, [open, doctor, form]);

  function submit(values: DoctorValues) {
    if (doctor) {
      updateDoctor.mutate(
        { id: doctor.id, input: values },
        {
          onSuccess: () => {
            toast.success("Doctor updated");
            onOpenChange(false);
          },
        },
      );
    } else {
      createDoctor.mutate(values, {
        onSuccess: () => {
          toast.success("Doctor added", {
            description: `Login created for ${values.email}. Share sign-in instructions securely.`,
          });
          onOpenChange(false);
        },
        onError: (e) => toast.error(e instanceof Error ? e.message : "Could not add doctor"),
      });

    }
  }

  const pending = createDoctor.isPending || updateDoctor.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{doctor ? "Edit doctor" : "Add doctor"}</DialogTitle>
          <DialogDescription>
            {doctor
              ? "Update this doctor's practice details."
              : "A secure temporary password is assigned by the clinic administrator."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input placeholder="Dr. Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="doctor@care-reach.ng"
                        disabled={Boolean(doctor)}
                        {...field}
                      />
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
                      <Input placeholder="0803 123 4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="specializationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialization</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select one" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {specializations.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <FormField
                control={form.control}
                name="available"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <FormLabel>Accepting patients</FormLabel>
                      <FormDescription className="text-xs">
                        Toggle availability for booking
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Short professional bio" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {doctor ? "Save changes" : "Add doctor"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
