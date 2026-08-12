"use client";

import { useState } from "react";
import { Eye, Pencil, Plus, Stethoscope, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { ConfirmDialog } from "@/components/confirm-dialog";
import { DoctorFormDialog } from "@/components/admin/doctor-form-dialog";
import { DoctorViewDialog } from "@/components/admin/doctor-view-dialog";
import { useDeleteDoctor, useDoctors } from "@/hooks/use-doctors";
import type { Doctor } from "@/types";

export default function AdminDoctorsPage() {
  const { data: doctors, isLoading } = useDoctors();
  const deleteDoctor = useDeleteDoctor();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Doctor | null>(null);
  const [viewing, setViewing] = useState<Doctor | null>(null);
  const [deleting, setDeleting] = useState<Doctor | null>(null);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-foreground">Doctors</h2>
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus className="size-4" /> Add doctor
        </Button>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : (doctors ?? []).length === 0 ? (
        <EmptyState
          icon={Stethoscope}
          title="No doctors yet"
          description="Add your first practitioner to start accepting bookings."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(doctors ?? []).map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.name}</TableCell>
                  <TableCell>{d.specializationName}</TableCell>
                  <TableCell>{d.experienceYears} yrs</TableCell>
                  <TableCell>₦{d.fee.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" aria-label="View" onClick={() => setViewing(d)}>
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Edit"
                        onClick={() => {
                          setEditing(d);
                          setFormOpen(true);
                        }}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => setDeleting(d)}>
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <DoctorFormDialog open={formOpen} doctor={editing} onOpenChange={setFormOpen} />
      <DoctorViewDialog doctor={viewing} onOpenChange={(o) => !o && setViewing(null)} />
      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Delete this doctor?"
        description="This removes the doctor and all of their appointments. This cannot be undone."
        confirmLabel="Delete doctor"
        onConfirm={() => {
          if (!deleting) return;
          deleteDoctor.mutate(deleting.id, { onSuccess: () => toast.success("Doctor deleted") });
          setDeleting(null);
        }}
      />
    </div>
  );
}
