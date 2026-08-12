import {
  Activity,
  Baby,
  Bone,
  Brain,
  Sparkles,
  HeartPulse,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    icon: HeartPulse,
    title: "Cardiology",
    text: "Preventive heart screening, ECG, arrhythmia and blood pressure management.",
  },
  {
    icon: Sparkles,
    title: "Dermatology",
    text: "Medical and cosmetic skin care, mole checks and chronic condition treatment.",
  },
  {
    icon: Baby,
    title: "Paediatrics",
    text: "Growth monitoring, vaccinations and gentle care for children of all ages.",
  },
  {
    icon: Bone,
    title: "Orthopedics",
    text: "Sports injuries, joint pain, fracture care and post-surgical rehabilitation.",
  },
  {
    icon: Brain,
    title: "Neurology",
    text: "Migraine, epilepsy and movement disorder diagnosis and long-term care.",
  },
  {
    icon: Activity,
    title: "Diagnostics",
    text: "On-site labs and imaging with results delivered straight to your portal.",
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 lg:py-24">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Our services
        </p>
        <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
          Complete care under one roof
        </h2>
        <p className="mt-3 text-muted-foreground">
          Five specialist departments and on-site diagnostics, coordinated by a single
          care team so nothing falls through the cracks.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <Card key={s.title} className="border-border/70 transition-shadow hover:shadow-[var(--shadow-card)]">
            <CardContent className="p-6">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <s.icon className="size-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
