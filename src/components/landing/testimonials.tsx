"use client";

import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { initials } from "@/lib/appointment-utils";
import { useReviews } from "@/hooks/use-reviews";

export function Testimonials() {
  const { data: testimonials = [] } = useReviews();
  return (
    <section className="border-y border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-16 lg:py-24">
        <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
          What our patients say
        </h2>
        {testimonials.length === 0 ? (
          <p className="mt-6 text-muted-foreground">Patient feedback will appear here after completed visits.</p>
        ) : (
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.slice(0, 3).map((t) => (
            <Card key={t.id} className="border-border/70">
              <CardContent className="p-6">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`size-4 ${i < t.rating ? "fill-warning text-warning" : "text-muted-foreground"}`} />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-foreground">
                  “{t.comment}”
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                    {initials(t.patientName)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.patientName}</p>
                    <p className="text-xs text-muted-foreground">Patient of {t.doctorName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}
