"use client";

import { useMemo, useState } from "react";
import { Stethoscope } from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { DoctorCard } from "@/components/doctors/doctor-card";
import { DoctorFilters } from "@/components/doctors/doctor-filters";
import { CardsSkeleton } from "@/components/table-skeleton";
import { EmptyState } from "@/components/empty-state";
import { useDoctors, useSpecializations } from "@/hooks/use-doctors";

export default function DoctorsPage() {
  const { data: doctors, isLoading } = useDoctors();
  const { data: specializations = [] } = useSpecializations();
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("all");

  const filtered = useMemo(() => {
    return (doctors ?? []).filter((d) => {
      const matchesName = d.name.toLowerCase().includes(search.trim().toLowerCase());
      const matchesSpec = specialization === "all" || d.specializationId === specialization;
      return matchesName && matchesSpec;
    });
  }, [doctors, search, specialization]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Find a doctor</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Search our specialists and book directly with the practitioner that fits your needs.
        </p>
        <div className="mt-8">
          <DoctorFilters
            search={search}
            onSearchChange={setSearch}
            specialization={specialization}
            onSpecializationChange={setSpecialization}
            specializations={specializations}
          />
        </div>
        <div className="mt-8">
          {isLoading ? (
            <CardsSkeleton />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={Stethoscope}
              title="No doctors found"
              description="Try a different name or clear the specialization filter."
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((d) => (
                <DoctorCard key={d.id} doctor={d} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
