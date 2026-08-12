"use client";

import { useState } from "react";
import { CalendarX } from "lucide-react";
import { toast } from "sonner";
import { AppointmentTable, ActionButton } from "@/components/appointments/appointment-table";
import { AppointmentDetailDialog } from "@/components/appointments/appointment-detail-dialog";
import { CancelAppointmentDialog } from "@/components/appointments/cancel-appointment-dialog";
import { TableSkeleton } from "@/components/table-skeleton";
import { EmptyState } from "@/components/empty-state";
import { useAppointments, useUpdateAppointmentStatus } from "@/hooks/use-appointments";
import type { Appointment } from "@/types";

export default function AdminAppointmentsPage() {
  const { data: appointments, isLoading } = useAppointments();
  const update = useUpdateAppointmentStatus();
  const [viewing, setViewing] = useState<Appointment | null>(null);
  const [cancelling, setCancelling] = useState<Appointment | null>(null);

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-foreground">All appointments</h2>
      {isLoading ? (
        <TableSkeleton cols={6} />
      ) : (appointments ?? []).length === 0 ? (
        <EmptyState icon={CalendarX} title="No appointments yet" />
      ) : (
        <AppointmentTable
          appointments={appointments ?? []}
          actions={(a) => (
            <>
              <ActionButton onClick={() => setViewing(a)}>View</ActionButton>
              {a.status === "PENDING" ? (
                <ActionButton
                  variant="default"
                  onClick={() =>
                    update.mutate(
                      { id: a.id, status: "APPROVED" },
                      { onSuccess: () => toast.success("Appointment approved") },
                    )
                  }
                >
                  Approve
                </ActionButton>
              ) : null}
              {a.status === "APPROVED" ? (
                <ActionButton
                  variant="secondary"
                  onClick={() =>
                    update.mutate(
                      { id: a.id, status: "COMPLETED" },
                      { onSuccess: () => toast.success("Marked completed") },
                    )
                  }
                >
                  Complete
                </ActionButton>
              ) : null}
              {a.status === "PENDING" || a.status === "APPROVED" ? (
                <ActionButton variant="destructive" onClick={() => setCancelling(a)}>
                  Cancel
                </ActionButton>
              ) : null}
            </>
          )}
        />
      )}
      <AppointmentDetailDialog appointment={viewing} onOpenChange={(o) => !o && setViewing(null)} />
      <CancelAppointmentDialog
        appointment={cancelling}
        requireReason
        onOpenChange={(o) => !o && setCancelling(null)}
      />
    </div>
  );
}
