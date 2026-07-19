import type { Metadata } from "next";
import { Compass, Target } from "lucide-react";

import { teamMembers, timeline } from "@/lib/marketplace-data";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About — Slotwise",
  description: "Why Slotwise exists, how it started, and the team building it.",
};

export default function AboutPage() {
  return (
    <div>
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <Reveal>
          <p className="text-sm font-medium text-brand-cyan">About us</p>
          <h1 className="mt-2 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            We built the booking system creative spaces deserved
          </h1>
          <p className="mt-5 text-balance text-lg text-muted-foreground">
            Slotwise started because two studio owners were tired of managing bookings over text.
            Today it's the fastest way to find and book photography, podcast, video, and music
            studios — with real availability, no back-and-forth.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Reveal>
            <Card className="h-full p-8">
              <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-violet to-brand-cyan text-white">
                <Target className="size-5" />
              </div>
              <h2 className="mt-4 font-heading text-xl font-medium">Our mission</h2>
              <p className="mt-2 text-muted-foreground">
                Make booking a creative space as easy as booking a flight — transparent pricing,
                real-time availability, zero back-and-forth.
              </p>
            </Card>
          </Reveal>
          <Reveal delay={0.1}>
            <Card className="h-full p-8">
              <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-violet to-brand-cyan text-white">
                <Compass className="size-5" />
              </div>
              <h2 className="mt-4 font-heading text-xl font-medium">Our vision</h2>
              <p className="mt-2 text-muted-foreground">
                A world where any creator, anywhere, can find the right space for their next
                project in minutes — not days of DMs and phone tag.
              </p>
            </Card>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20">
        <Reveal className="mb-12 text-center">
          <p className="text-sm font-medium text-brand-cyan">Our story</p>
          <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight">How we got here</h2>
        </Reveal>

        <div className="relative space-y-10 border-l border-border pl-8">
          {timeline.map((item, i) => (
            <Reveal key={item.year} delay={i * 0.05}>
              <div className="relative">
                <span className="absolute -left-[2.35rem] top-1 flex size-4 items-center justify-center rounded-full bg-gradient-to-br from-brand-violet to-brand-cyan ring-4 ring-background" />
                <p className="text-sm font-medium text-brand-cyan">{item.year}</p>
                <h3 className="mt-1 font-heading font-medium">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <Reveal className="mb-10 text-center">
          <p className="text-sm font-medium text-brand-cyan">Team</p>
          <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight">The people behind Slotwise</h2>
        </Reveal>

        <RevealGroup className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {teamMembers.map((member) => (
            <RevealItem key={member.name} className="flex flex-col items-center text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-violet to-brand-cyan text-lg font-semibold text-white">
                {member.initials}
              </div>
              <p className="mt-3 text-sm font-medium">{member.name}</p>
              <p className="text-xs text-muted-foreground">{member.role}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>
    </div>
  );
}
