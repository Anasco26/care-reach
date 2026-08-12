import { CalendarCheck, Clock4, ShieldCheck, Stethoscope } from "lucide-react";

const points = [
  {
    icon: CalendarCheck,
    title: "Instant online booking",
    text: "See live availability per doctor and lock in your slot without a phone call.",
  },
  {
    icon: Stethoscope,
    title: "Experienced specialists",
    text: "Every practitioner is board certified with an average of 10 years in practice.",
  },
  {
    icon: Clock4,
    title: "Short waiting times",
    text: "Slot-based scheduling keeps our average waiting room time under 12 minutes.",
  },
  {
    icon: ShieldCheck,
    title: "Your records, protected",
    text: "Appointment history and notes stay private to you and your care team.",
  },
];

export function WhyChooseUs() {
  return (
    <section id="why-us" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Why CareReach
          </p>
          <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
            Care that respects your time
          </h2>
          <p className="mt-3 max-w-md text-muted-foreground">
            We built our scheduling around patients, not paperwork. Request a visit,
            track its status, and get reminders — all from one place.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {points.map((p) => (
            <div key={p.title}>
              <div className="flex size-10 items-center justify-center rounded-lg bg-success/12 text-success">
                <p.icon className="size-5" />
              </div>
              <h3 className="mt-3 font-semibold text-foreground">{p.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
