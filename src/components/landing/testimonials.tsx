import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { initials } from "@/lib/appointment-utils";

const testimonials = [
  {
    name: "Rebecca Lindqvist",
    role: "Patient since 2019",
    quote:
      "I booked a cardiology follow-up on a Sunday evening and had it confirmed by Monday morning. The whole process took two minutes.",
  },
  {
    name: "Tomás Herrera",
    role: "Parent of two",
    quote:
      "The paediatrics team is wonderful with my kids, and being able to see every past visit in one place has been a lifesaver.",
  },
  {
    name: "Aisha Bello",
    role: "Patient since 2022",
    quote:
      "Clear appointment statuses meant I always knew where I stood. No more chasing reception for confirmations.",
  },
];

export function Testimonials() {
  return (
    <section className="border-y border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-16 lg:py-24">
        <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
          What our patients say
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="border-border/70">
              <CardContent className="p-6">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-foreground">
                  “{t.quote}”
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                    {initials(t.name)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
