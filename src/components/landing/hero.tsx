import Link from "next/link";
import { CalendarPlus, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-accent/50 to-background">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <ShieldCheck className="size-3.5" />
            Trusted care since 2004
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-[1.1] text-foreground sm:text-5xl lg:text-6xl">
            Book your clinic visit in under a minute
          </h1>
          <p className="mt-5 max-w-lg text-lg text-muted-foreground">
            CareBridge connects you with specialists across cardiology, dermatology,
            paediatrics, orthopedics and neurology — with real-time availability and
            instant confirmation.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
            <Link href="/doctors">
              <CalendarPlus className="size-4" />
              Book an appointment
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
              <Link href="/register">Create an account</Link>
          </Button>
          </div>
          <div className="mt-9 flex flex-wrap gap-8">
            {[
              { value: "25+", label: "Specialists" },
              { value: "18k", label: "Visits booked" },
              { value: "4.9", label: "Patient rating" },
            ].map((s) => (
              <div key={s.label}>
                <p className="flex items-center gap-1 text-2xl font-bold text-foreground">
                  {s.value}
                  {s.label === "Patient rating" ? (
                    <Star className="size-4 fill-warning text-warning" />
                  ) : null}
                </p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <img
            src="/clinic-hero.jpg"
            alt="Doctor consulting with a patient in a bright modern clinic reception"
            width={1600}
            height={1200}
            className="w-full rounded-2xl object-cover shadow-[var(--shadow-elevated)]"
          />
        </div>
      </div>
    </section>
  );
}
