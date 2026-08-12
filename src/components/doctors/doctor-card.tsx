import Link from "next/link";
import { BadgeCheck, CalendarPlus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { initials } from "@/lib/appointment-utils";
import type { Doctor } from "@/types";

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <Card className="group overflow-hidden border-border/70 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-accent text-lg font-semibold text-accent-foreground">
            {initials(doctor.name)}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-foreground">
              {doctor.name}
            </h3>
            <p className="text-sm font-medium text-primary">
              {doctor.specializationName}
            </p>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {doctor.bio}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4" /> {doctor.experienceYears} yrs experience
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BadgeCheck
              className={
                doctor.available ? "size-4 text-success" : "size-4 text-muted-foreground"
              }
            />
            {doctor.available ? "Accepting patients" : "Unavailable"}
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <span className="text-sm font-semibold text-foreground">
            ₦{doctor.fee.toLocaleString()}
            <span className="font-normal text-muted-foreground"> / visit</span>
          </span>
          <Button asChild size="sm" disabled={!doctor.available}>
            <Link href={`/doctors/${doctor.id}`}>
              <CalendarPlus className="size-4" />
              Book
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
