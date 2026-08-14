import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const details = [
  { icon: MapPin, label: "Address", value: "14 Harborview Road, Springfield" },
  { icon: Phone, label: "Phone", value: "+234 803 123 4567" },
  { icon: Mail, label: "Email", value: "hello@care-reach.ng" },
  { icon: Clock, label: "Opening hours", value: "Mon–Sat · 09:00 – 17:00" },
];

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 lg:py-24">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Get in touch
          </p>
          <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
            Visit us or book online
          </h2>
          <p className="mt-3 max-w-md text-muted-foreground">
            Our front desk is happy to help with anything the portal can&apos;t. For the
            fastest route to a consultation, book directly with a specialist.
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link href="/doctors">Book an appointment</Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {details.map((d) => (
            <Card key={d.label} className="border-border/70">
              <CardContent className="p-5">
                <d.icon className="size-5 text-primary" />
                <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">
                  {d.label}
                </p>
                <p className="text-sm font-medium text-foreground">{d.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
