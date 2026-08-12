"use client";

import { useState } from "react";
import { History } from "lucide-react";
import { AppointmentTable, ActionButton } from "@/components/appointments/appointment-table";
import { AppointmentDetailDialog } from "@/components/appointments/appointment-detail-dialog";
import { TableSkeleton } from "@/components/table-skeleton";
import { EmptyState } from "@/components/empty-state";
import { useAppointments } from "@/hooks/use-appointments";
import { isUpcoming } from "@/lib/appointment-utils";
import { useAuth } from "@/contexts/auth-context";
import type { Appointment } from "@/types";

export default function PatientHistoryPage() {
  const { user } = useAuth();
  const { data: appointments, isLoading } = useAppointments({ patientId: user?.profileId ?? "" });
  const [viewing, setViewing] = useState<Appointment | null>(null);
  const past = (appointments ?? []).filter((a) => !isUpcoming(a));

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-foreground">Appointment history</h2>
      {isLoading ? (
        <TableSkeleton cols={5} />
      ) : past.length === 0 ? (
        <EmptyState icon={History} title="No past appointments" />
      ) : (
        <AppointmentTable
          appointments={past}
          showPatient={false}
          actions={(a) => <ActionButton onClick={() => setViewing(a)}>View</ActionButton>}
        />
      )}
      <AppointmentDetailDialog appointment={viewing} onOpenChange={(o) => !o && setViewing(null)} />
    </div>
  );
}
