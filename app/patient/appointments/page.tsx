"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppointmentTable, ActionButton } from "@/components/appointments/appointment-table";
import { AppointmentDetailDialog } from "@/components/appointments/appointment-detail-dialog";
import { CancelAppointmentDialog } from "@/components/appointments/cancel-appointment-dialog";
import { TableSkeleton } from "@/components/table-skeleton";
import { EmptyState } from "@/components/empty-state";
import { useAppointments } from "@/hooks/use-appointments";
import { isUpcoming } from "@/lib/appointment-utils";
import { useAuth } from "@/contexts/auth-context";
import type { Appointment } from "@/types";

export default function PatientAppointmentsPage() {
  const { user } = useAuth();
  const { data: appointments, isLoading } = useAppointments({ patientId: user?.profileId ?? "" });
  const [viewing, setViewing] = useState<Appointment | null>(null);
  const [cancelling, setCancelling] = useState<Appointment | null>(null);
  const upcoming = (appointments ?? []).filter(isUpcoming);

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-foreground">My appointments</h2>
      {isLoading ? (
        <TableSkeleton cols={5} />
      ) : upcoming.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="Nothing booked yet"
          action={
            <Button asChild>
              <Link href="/doctors">Find a doctor</Link>
            </Button>
          }
        />
      ) : (
        <AppointmentTable
          appointments={upcoming}
          showPatient={false}
          actions={(a) => (
            <>
              <ActionButton onClick={() => setViewing(a)}>View</ActionButton>
              <ActionButton variant="destructive" onClick={() => setCancelling(a)}>
                Cancel
              </ActionButton>
            </>
          )}
        />
      )}
      <AppointmentDetailDialog appointment={viewing} onOpenChange={(o) => !o && setViewing(null)} />
      <CancelAppointmentDialog
        appointment={cancelling}
        requireReason={false}
        onOpenChange={(o) => !o && setCancelling(null)}
      />
    </div>
  );
}
