import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@/lib/zod-resolver";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cancelSchema, type CancelValues } from "@/lib/validations/appointment";
import { useUpdateAppointmentStatus } from "@/hooks/use-appointments";
import type { Appointment } from "@/types";

export function CancelAppointmentDialog({
  appointment,
  requireReason,
  title = "Cancel appointment",
  onOpenChange,
}: {
  appointment: Appointment | null;
  requireReason: boolean;
  title?: string;
  onOpenChange: (open: boolean) => void;
}) {
  const update = useUpdateAppointmentStatus();
  const form = useForm<CancelValues, unknown, CancelValues>({
    resolver: zodResolver(cancelSchema),
    defaultValues: { cancelReason: "" },
  });

  useEffect(() => {
    if (appointment) form.reset({ cancelReason: "" });
  }, [appointment, form]);

  function submit(values: CancelValues) {
    if (!appointment) return;
    update.mutate(
      {
        id: appointment.id,
        status: "CANCELLED",
        cancelReason: values.cancelReason,
      },
      {
        onSuccess: () => {
          toast.success("Appointment cancelled");
          onOpenChange(false);
        },
      },
    );
  }

  function cancelWithoutReason() {
    if (!appointment) return;
    update.mutate(
      {
        id: appointment.id,
        status: "CANCELLED",
        cancelReason: "Cancelled by patient",
      },
      {
        onSuccess: () => {
          toast.success("Appointment cancelled");
          onOpenChange(false);
        },
      },
    );
  }

  return (
    <Dialog open={Boolean(appointment)} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {requireReason
              ? "Please provide a reason — it will be shared with the patient."
              : "You can optionally add a note about why you're cancelling."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cancelReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Reason {requireReason ? "" : "(optional)"}
                  </FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Reason for cancellation" {...field} />
                  </FormControl>
                  {requireReason ? <FormMessage /> : null}
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Keep appointment
              </Button>
              {requireReason ? (
                <Button type="submit" variant="destructive" disabled={update.isPending}>
                  Cancel appointment
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="destructive"
                  disabled={update.isPending}
                  onClick={() => {
                    const reason = form.getValues("cancelReason");
                    if (reason && reason.trim().length >= 5) {
                      submit({ cancelReason: reason });
                    } else {
                      cancelWithoutReason();
                    }
                  }}
                >
                  Cancel appointment
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
