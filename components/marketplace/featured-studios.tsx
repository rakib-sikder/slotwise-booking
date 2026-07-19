import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { studios } from "@/lib/marketplace-data";
import { StudioCard } from "@/components/marketplace/studio-card";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

export function FeaturedStudios() {
  const featured = studios.filter((s) => s.featured);

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <Reveal className="mb-10 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-brand-cyan">Handpicked</p>
          <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Featured studios</h2>
        </div>
        <Link href="/studios" className="hidden shrink-0 items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:flex">
          View all <ArrowRight className="size-4" />
        </Link>
      </Reveal>

      <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((studio) => (
          <RevealItem key={studio.id}>
            <StudioCard studio={studio} />
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
