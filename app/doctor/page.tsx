"use client";

import { useState } from "react";
import { CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { AppointmentTable, ActionButton } from "@/components/appointments/appointment-table";
import { AppointmentDetailDialog } from "@/components/appointments/appointment-detail-dialog";
import { CancelAppointmentDialog } from "@/components/appointments/cancel-appointment-dialog";
import { TableSkeleton } from "@/components/table-skeleton";
import { EmptyState } from "@/components/empty-state";
import { StatCard } from "@/components/dashboard/stat-card";
import { useAppointments, useUpdateAppointmentStatus } from "@/hooks/use-appointments";
import { isUpcoming, hasStarted, formatDate, formatTime } from "@/lib/appointment-utils";
import { useAuth } from "@/contexts/auth-context";
import type { Appointment } from "@/types";

export default function DoctorOverviewPage() {
  const { user } = useAuth();
  const { data: appointments, isLoading } = useAppointments({ doctorId: user?.profileId ?? "" });
  const update = useUpdateAppointmentStatus();
  const [viewing, setViewing] = useState<Appointment | null>(null);
  const [cancelling, setCancelling] = useState<Appointment | null>(null);

  const upcoming = (appointments ?? []).filter(isUpcoming);
  const pending = upcoming.filter((a) => a.status === "PENDING").length;
  const completed = (appointments ?? []).filter((a) => a.status === "COMPLETED").length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Upcoming" value={upcoming.length} icon={CalendarClock} />
        <StatCard label="Awaiting approval" value={pending} icon={CalendarClock} tone="warning" />
        <StatCard label="Completed" value={completed} icon={CalendarClock} tone="success" />
      </div>
      <h2 className="text-lg font-semibold text-foreground">Upcoming appointments</h2>
      {isLoading ? (
        <TableSkeleton cols={5} />
      ) : upcoming.length === 0 ? (
        <EmptyState icon={CalendarClock} title="No upcoming appointments" description="New patient requests will appear here." />
      ) : (
        <AppointmentTable
          appointments={upcoming}
          showDoctor={false}
          actions={(a) => {
            const started = hasStarted(a);
            return (
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
                    disabled={!started}
                    title={started ? "Mark this consultation as completed" : `Available from ${formatDate(a.date)} at ${formatTime(a.time)}`}
                    onClick={() =>
                      update.mutate(
                        { id: a.id, status: "COMPLETED" },
                        { onSuccess: () => toast.success("Marked completed") },
                      )
                    }
                  >
                    Mark completed
                  </ActionButton>
                ) : null}
                <ActionButton variant="destructive" onClick={() => setCancelling(a)}>
                  Cancel
                </ActionButton>
              </>
            );
          }}
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
