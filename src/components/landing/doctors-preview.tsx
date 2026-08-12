"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DoctorCard } from "@/components/doctors/doctor-card";
import { CardsSkeleton } from "@/components/table-skeleton";
import { useDoctors } from "@/hooks/use-doctors";

export function DoctorsPreview() {
  const { data: doctors, isLoading } = useDoctors();

  return (
    <section className="border-y border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-16 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Our doctors
            </p>
            <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
              Meet the specialists
            </h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/doctors">
              View all doctors <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-10">
          {isLoading ? (
            <CardsSkeleton count={3} />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {(doctors ?? []).slice(0, 3).map((d) => (
                <DoctorCard key={d.id} doctor={d} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
