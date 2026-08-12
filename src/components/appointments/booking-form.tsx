"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@/lib/zod-resolver";
import { useRouter } from "next/navigation";
import { CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { bookingSchema, type BookingValues } from "@/lib/validations/appointment";
import { TIME_SLOTS, formatDate, formatTime, toDateKey } from "@/lib/appointment-utils";
import { useBookedSlots, useCreateAppointment } from "@/hooks/use-appointments";
import { useAuth } from "@/contexts/auth-context";
import type { Doctor } from "@/types";

export function BookingForm({ doctor }: { doctor: Doctor }) {
  const { user } = useAuth();
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const createAppointment = useCreateAppointment();

  const form = useForm<BookingValues, unknown, BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { date: "", time: "", reason: "" },
  });

  const selectedDate = form.watch("date");
  const { data: booked = [] } = useBookedSlots(doctor.id, selectedDate);
  const takenSlots = new Set(booked);
  const doctorSlots = TIME_SLOTS.filter((s) =>
    doctor.availableSlots.length ? doctor.availableSlots.includes(s) : true,
  );

  function onSubmit(values: BookingValues) {
    if (!user) {
      toast.error("Please sign in to book an appointment");
      router.push("/login");
      return;
    }
    if (user.role !== "PATIENT") {
      toast.error("Only patient accounts can book appointments");
      return;
    }
    createAppointment.mutate(
      {
        doctorId: doctor.id,
        patientId: user.profileId,
        date: values.date,
        time: values.time,
        reason: values.reason,
      },
      {
        onSuccess: () => {
          toast.success("Appointment requested — awaiting approval");
          form.reset({ date: "", time: "", reason: "" });
          setDate(undefined);
          router.push("/patient/appointments");
        },
        onError: (error: Error) => toast.error(error.message),
      },
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Appointment date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="size-4" />
                      {field.value ? formatDate(field.value) : "Pick a date"}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(value) => {
                      setDate(value);
                      field.onChange(value ? toDateKey(value) : "");
                      form.setValue("time", "");
                    }}
                    disabled={(d) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return d < today || d.getDay() === 0;
                    }}
                    className={cn("pointer-events-auto p-3")}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time slot</FormLabel>
              {!selectedDate ? (
                <p className="text-sm text-muted-foreground">
                  Choose a date to see available time slots.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {doctorSlots.length === 0 ? (
                    <p className="col-span-full text-sm text-muted-foreground">
                      This doctor has not published any available times.
                    </p>
                  ) : null}
                  {doctorSlots.map((slot) => {
                    const taken = takenSlots.has(slot);
                    const active = field.value === slot;
                    return (
                      <Button
                        key={slot}
                        type="button"
                        size="sm"
                        variant={active ? "default" : "outline"}
                        disabled={taken}
                        onClick={() => field.onChange(slot)}
                        className={cn(taken && "line-through opacity-50")}
                      >
                        {formatTime(slot)}
                      </Button>
                    );
                  })}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason for visit</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="Briefly describe your symptoms or reason for the visit"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={createAppointment.isPending || !doctor.available}
        >
          {createAppointment.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : null}
          {doctor.available ? "Request appointment" : "Doctor unavailable"}
        </Button>
      </form>
    </Form>
  );
}
