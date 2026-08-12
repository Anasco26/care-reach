import { cn } from "@/lib/utils";
import { statusLabel } from "@/lib/appointment-utils";
import type { AppointmentStatus } from "@/types";

const styles: Record<AppointmentStatus, string> = {
  PENDING: "bg-warning/15 text-warning-foreground ring-warning/30",
  APPROVED: "bg-info/15 text-info ring-info/30",
  COMPLETED: "bg-success/15 text-success ring-success/30",
  CANCELLED: "bg-destructive/10 text-destructive ring-destructive/25",
};

export function StatusBadge({
  status,
  className,
}: {
  status: AppointmentStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        styles[status],
        className,
      )}
    >
      {statusLabel[status]}
    </span>
  );
}
