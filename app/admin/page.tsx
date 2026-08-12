"use client";

import { CalendarClock, CheckCircle2, ClipboardList, Stethoscope, Users, XCircle } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  GenderChart,
  MonthlyAppointmentsChart,
  SpecializationChart,
  StatusDistributionChart,
} from "@/components/dashboard/charts";
import { ChartSkeleton } from "@/components/table-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { useStats } from "@/hooks/use-appointments";

export default function AdminOverviewPage() {
  const { data, isLoading } = useStats();

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  const s = data.stats;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Doctors" value={s.totalDoctors} icon={Stethoscope} />
        <StatCard label="Patients" value={s.totalPatients} icon={Users} tone="info" />
        <StatCard label="Appointments" value={s.totalAppointments} icon={ClipboardList} />
        <StatCard label="Pending" value={s.pending} icon={CalendarClock} tone="warning" />
        <StatCard label="Completed" value={s.completed} icon={CheckCircle2} tone="success" />
        <StatCard label="Cancelled" value={s.cancelled} icon={XCircle} tone="destructive" />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <MonthlyAppointmentsChart data={data.monthly} />
        <StatusDistributionChart data={data.status} />
        <GenderChart data={data.gender} />
        <SpecializationChart data={data.specialization} />
      </div>
    </div>
  );
}
