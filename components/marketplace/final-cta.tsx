import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-violet/20 via-card to-brand-cyan/10 p-12 text-center ring-1 ring-foreground/10 sm:p-20">
          <div className="pointer-events-none absolute -left-20 -top-20 size-64 rounded-full bg-brand-violet/30 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 size-64 rounded-full bg-brand-cyan/20 blur-[100px]" />
          <div className="relative">
            <h2 className="mx-auto max-w-xl text-balance font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to book your next session?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-balance text-muted-foreground">
              Join 500+ creators who book their studio time on Slotwise.
            </p>
            <Button
              render={<Link href="/studios" />}
              className="mt-8 h-12 rounded-full bg-gradient-to-r from-brand-violet to-brand-cyan px-8 text-base text-white shadow-[0_0_40px_-8px_var(--brand-violet)] transition-transform hover:scale-[1.03]"
            >
              Explore studios
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
