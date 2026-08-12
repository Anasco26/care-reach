import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { initials } from "@/lib/appointment-utils";
import type { Doctor } from "@/types";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6 border-b border-border py-2.5 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

export function DoctorViewDialog({
  doctor,
  onOpenChange,
}: {
  doctor: Doctor | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={Boolean(doctor)} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Doctor profile</DialogTitle>
          <DialogDescription>Read-only view of the practitioner record.</DialogDescription>
        </DialogHeader>
        {doctor ? (
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-accent font-semibold text-accent-foreground">
                {initials(doctor.name)}
              </div>
              <div>
                <p className="font-semibold text-foreground">{doctor.name}</p>
                <p className="text-sm text-primary">{doctor.specializationName}</p>
              </div>
            </div>
            <Row label="Email" value={doctor.email} />
            <Row label="Phone" value={doctor.phone} />
            <Row label="Experience" value={`${doctor.experienceYears} years`} />
            <Row label="Fee" value={`₦${doctor.fee.toLocaleString()}`} />
            <Row label="Gender" value={doctor.gender.toLowerCase()} />
            <Row label="Status" value={doctor.available ? "Accepting patients" : "Unavailable"} />
            <Row label="Bio" value={doctor.bio || "—"} />
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
