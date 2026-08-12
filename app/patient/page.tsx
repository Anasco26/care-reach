"use client";

import Link from "next/link";
import { CalendarCheck, CalendarClock, CheckCircle2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { AppointmentTable } from "@/components/appointments/appointment-table";
import { TableSkeleton } from "@/components/table-skeleton";
import { EmptyState } from "@/components/empty-state";
import { useAppointments } from "@/hooks/use-appointments";
import { isUpcoming } from "@/lib/appointment-utils";
import { useAuth } from "@/contexts/auth-context";

export default function PatientOverviewPage() {
  const { user } = useAuth();
  const { data: appointments, isLoading } = useAppointments({ patientId: user?.profileId ?? "" });
  const all = appointments ?? [];
  const upcoming = all.filter(isUpcoming);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">Welcome back, {user?.name}</h2>
        <Button asChild>
          <Link href="/doctors">
            <Plus className="size-4" /> Book appointment
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Upcoming" value={upcoming.length} icon={CalendarClock} />
        <StatCard label="Total visits" value={all.length} icon={CalendarCheck} tone="info" />
        <StatCard
          label="Completed"
          value={all.filter((a) => a.status === "COMPLETED").length}
          icon={CheckCircle2}
          tone="success"
        />
      </div>
      <h3 className="text-base font-semibold text-foreground">Next appointments</h3>
      {isLoading ? (
        <TableSkeleton cols={5} />
      ) : upcoming.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="No upcoming appointments"
          description="Browse our specialists and book your next visit."
          action={
            <Button asChild>
              <Link href="/doctors">Find a doctor</Link>
            </Button>
          }
        />
      ) : (
        <AppointmentTable appointments={upcoming} showPatient={false} />
      )}
    </div>
  );
}
