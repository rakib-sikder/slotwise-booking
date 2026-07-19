import { Suspense } from "react";
import type { Metadata } from "next";

import { StudiosBrowser } from "@/components/marketplace/studios-browser";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Browse studios — Slotwise",
  description: "Filter photography, podcast, video, and music studios by category, price, and rating.",
};

export default function StudiosPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Reveal className="mb-10">
        <p className="text-sm font-medium text-brand-cyan">Studios</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Find your next creative space
        </h1>
        <p className="mt-3 max-w-lg text-muted-foreground">
          Real-time availability across photography, podcast, video, and music studios.
        </p>
      </Reveal>

      <Suspense>
        <StudiosBrowser />
      </Suspense>
    </div>
  );
}
