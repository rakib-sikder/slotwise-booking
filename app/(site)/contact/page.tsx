import type { Metadata } from "next";
import { Clock, Mail, Phone } from "lucide-react";

import { ContactForm } from "@/components/marketplace/contact-form";
import { StudioMap } from "@/components/marketplace/studio-map";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Contact — Slotwise",
  description: "Get in touch with the Slotwise team.",
};

const hours = [
  { day: "Monday – Friday", time: "9:00 AM – 7:00 PM" },
  { day: "Saturday", time: "10:00 AM – 5:00 PM" },
  { day: "Sunday", time: "Closed" },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <Reveal className="mb-12 text-center">
        <p className="text-sm font-medium text-brand-cyan">Contact</p>
        <h1 className="mt-2 font-heading text-4xl font-semibold tracking-tight">Let&apos;s talk</h1>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          Questions about a booking, listing your studio, or anything else — we usually reply within a day.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Reveal>
            <ContactForm />
          </Reveal>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Reveal delay={0.1}>
            <Card className="p-6">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="size-4 text-brand-cyan" />
                <span>hello@slotwise.example</span>
              </div>
              <div className="mt-3 flex items-center gap-3 text-sm">
                <Phone className="size-4 text-brand-cyan" />
                <span>(555) 010-2024</span>
              </div>
            </Card>
          </Reveal>

          <Reveal delay={0.15}>
            <Card className="p-6">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                <Clock className="size-4 text-brand-cyan" /> Business hours
              </div>
              <div className="space-y-1.5 text-sm">
                {hours.map((h) => (
                  <div key={h.day} className="flex justify-between text-muted-foreground">
                    <span>{h.day}</span>
                    <span className="text-foreground">{h.time}</span>
                  </div>
                ))}
              </div>
            </Card>
          </Reveal>

          <Reveal delay={0.2}>
            <StudioMap address="500 Market St, Suite 300" city="San Francisco, CA" />
          </Reveal>
        </div>
      </div>
    </div>
  );
}
