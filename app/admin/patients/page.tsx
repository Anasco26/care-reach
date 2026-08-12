"use client";

import { Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableSkeleton } from "@/components/table-skeleton";
import { EmptyState } from "@/components/empty-state";
import { usePatients } from "@/hooks/use-patients";

export default function AdminPatientsPage() {
  const { data: patients, isLoading } = usePatients();

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-foreground">Patients</h2>
      {isLoading ? (
        <TableSkeleton />
      ) : (patients ?? []).length === 0 ? (
        <EmptyState icon={Users} title="No patients registered yet" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Gender</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(patients ?? []).map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.email}</TableCell>
                  <TableCell>{p.phone}</TableCell>
                  <TableCell className="capitalize">{p.gender.toLowerCase()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
