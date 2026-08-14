"use client";

import { useEffect } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@/lib/zod-resolver";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateReview } from "@/hooks/use-reviews";
import type { Appointment } from "@/types";

const schema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().min(10, "Please share at least 10 characters.").max(1000),
});
type Values = z.infer<typeof schema>;

export function PatientRatingDialog({
  appointment,
  patientId,
  onOpenChange,
}: {
  appointment: Appointment | null;
  patientId: string;
  onOpenChange: (open: boolean) => void;
}) {
  const createReview = useCreateReview();
  const form = useForm<z.input<typeof schema>, unknown, Values>({ resolver: zodResolver(schema), defaultValues: { rating: 5, comment: "" } });

  useEffect(() => {
    if (appointment) form.reset({ rating: 5, comment: "" });
  }, [appointment, form]);

  function submit(values: Values) {
    if (!appointment) return;
    createReview.mutate(
      { appointmentId: appointment.id, patientId, doctorId: appointment.doctorId, ...values },
      {
        onSuccess: () => { toast.success("Thank you for your feedback"); onOpenChange(false); },
        onError: (error) => toast.error(error instanceof Error ? error.message : "Could not save your feedback"),
      },
    );
  }

  return (
    <Dialog open={Boolean(appointment)} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate your visit</DialogTitle>
          <DialogDescription>Share feedback about your appointment with {appointment?.doctorName}.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
            <FormField control={form.control} name="rating" render={({ field }) => (
              <FormItem>
                <FormLabel>Rating</FormLabel>
                <FormControl><Input type="number" min={1} max={5} {...field} value={String(field.value ?? "")} /></FormControl>
                <div className="flex gap-1 text-warning" aria-hidden="true">{[1, 2, 3, 4, 5].map((star) => <Star key={star} className="size-5 fill-current" />)}</div>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="comment" render={({ field }) => (
              <FormItem>
                <FormLabel>Comment</FormLabel>
                <FormControl><Textarea placeholder="How was your experience?" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <DialogFooter><Button type="submit" disabled={createReview.isPending}>{createReview.isPending ? "Submitting…" : "Submit feedback"}</Button></DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
