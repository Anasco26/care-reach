import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/status-badge";
import { formatDate, formatTime } from "@/lib/appointment-utils";
import type { Appointment } from "@/types";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6 border-b border-border py-2.5 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

export function AppointmentDetailDialog({
  appointment,
  onOpenChange,
}: {
  appointment: Appointment | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={Boolean(appointment)} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Appointment details</DialogTitle>
          <DialogDescription>
            Reference {appointment?.id ?? ""}
          </DialogDescription>
        </DialogHeader>
        {appointment ? (
          <div>
            <div className="mb-3">
              <StatusBadge status={appointment.status} />
            </div>
            <Row label="Patient" value={appointment.patientName} />
            <Row label="Doctor" value={appointment.doctorName} />
            <Row label="Specialization" value={appointment.specializationName} />
            <Row label="Date" value={formatDate(appointment.date)} />
            <Row label="Time" value={formatTime(appointment.time)} />
            <Row label="Reason" value={appointment.reason} />
            {appointment.cancelReason ? (
              <Row label="Cancellation reason" value={appointment.cancelReason} />
            ) : null}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
