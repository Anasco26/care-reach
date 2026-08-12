"use client";

import { useParams } from "next/navigation";
import { ArrowLeft, BadgeCheck, Clock, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { BookingForm } from "@/components/appointments/booking-form";
import { useDoctor } from "@/hooks/use-doctors";
import { initials } from "@/lib/appointment-utils";
import { useAuth } from "@/contexts/auth-context";

export default function DoctorDetailPage() {
  const params = useParams<{ doctorId: string }>();
  const doctorId = params.doctorId;
  const { data: doctor, isLoading } = useDoctor(doctorId);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href="/doctors">
            <ArrowLeft className="size-4" /> All doctors
          </Link>
        </Button>

        {isLoading ? (
          <Skeleton className="h-96 w-full rounded-xl" />
        ) : !doctor ? (
          <p className="text-muted-foreground">Doctor not found.</p>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
            <Card className="border-border/70">
              <CardContent className="p-7">
                <div className="flex items-center gap-4">
                  <div className="flex size-16 items-center justify-center rounded-full bg-accent text-xl font-semibold text-accent-foreground">
                    {initials(doctor.name)}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">{doctor.name}</h1>
                    <p className="font-medium text-primary">{doctor.specializationName}</p>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{doctor.bio}</p>
                <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="size-4" /> {doctor.experienceYears} years experience
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BadgeCheck className={doctor.available ? "size-4 text-success" : "size-4"} />{" "}
                    {doctor.available ? "Accepting patients" : "Currently unavailable"}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="size-4" /> {doctor.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="size-4" /> {doctor.phone}
                  </div>
                </dl>
                <p className="mt-6 text-lg font-semibold text-foreground">
                  ₦{doctor.fee.toLocaleString()}{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    per consultation
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/70">
              <CardHeader>
                <CardTitle className="text-lg">Book an appointment</CardTitle>
              </CardHeader>
              <CardContent>
                {user && user.role !== "PATIENT" ? (
                  <p className="text-sm text-muted-foreground">
                    Sign in with a patient account to book appointments.
                  </p>
                ) : (
                  <BookingForm doctor={doctor} />
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
