import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { formatDate, formatTime } from "@/lib/appointment-utils";
import type { Appointment } from "@/types";
import type { ReactNode } from "react";

export function AppointmentTable({
  appointments,
  showPatient = true,
  showDoctor = true,
  actions,
}: {
  appointments: Appointment[];
  showPatient?: boolean;
  showDoctor?: boolean;
  actions?: (appointment: Appointment) => ReactNode;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            {showPatient ? <TableHead>Patient</TableHead> : null}
            {showDoctor ? <TableHead>Doctor</TableHead> : null}
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
            {actions ? <TableHead className="text-right">Actions</TableHead> : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((a) => (
            <TableRow key={a.id}>
              {showPatient ? <TableCell className="font-medium">{a.patientName}</TableCell> : null}
              {showDoctor ? <TableCell>{a.doctorName}</TableCell> : null}
              <TableCell>{formatDate(a.date)}</TableCell>
              <TableCell>{formatTime(a.time)}</TableCell>
              <TableCell><StatusBadge status={a.status} /></TableCell>
              {actions ? <TableCell className="text-right"><div className="flex justify-end gap-2">{actions(a)}</div></TableCell> : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function ActionButton({ children, onClick, variant = "outline", disabled = false, title }: { children: ReactNode; onClick: () => void; variant?: "outline" | "default" | "destructive" | "secondary"; disabled?: boolean; title?: string }) {
  return <Button size="sm" variant={variant} onClick={onClick} disabled={disabled} title={title}>{children}</Button>;
}
