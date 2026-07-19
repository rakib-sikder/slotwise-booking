"use client";

import { useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";

import type { Studio } from "@/lib/marketplace-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toDateStr } from "@/lib/format";
import { cn } from "@/lib/utils";

const upcomingDays = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return { value: toDateStr(d), label: d.toLocaleDateString("en-US", { weekday: "short", day: "numeric" }) };
});

export function StudioSidebar({ studio }: { studio: Studio }) {
  const [date, setDate] = useState(upcomingDays[0].value);

  return (
    <Card className="sticky top-24 p-6">
      <div className="flex items-baseline justify-between">
        <p className="font-heading text-2xl font-semibold">
          ${studio.pricePerHour}
          <span className="text-sm font-normal text-muted-foreground"> / hour</span>
        </p>
        <span className="flex items-center gap-1 text-sm">
          <Star className="size-4 fill-brand-violet text-brand-violet" /> {studio.rating}
          <span className="text-muted-foreground">({studio.reviewCount})</span>
        </span>
      </div>

      <p className="mt-4 text-xs font-medium text-muted-foreground">Pick a date</p>
      <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1">
        {upcomingDays.map((d) => (
          <button
            key={d.value}
            onClick={() => setDate(d.value)}
            suppressHydrationWarning
            className={cn(
              "shrink-0 rounded-lg border px-3 py-2 text-xs font-medium transition-colors",
              d.value === date
                ? "border-transparent bg-gradient-to-r from-brand-violet to-brand-cyan text-white"
                : "border-border text-muted-foreground hover:border-brand-violet/40"
            )}
          >
            {d.label}
          </button>
        ))}
      </div>

      <Button
        render={<Link href={`/studios/${studio.slug}/book?date=${date}`} />}
        className="mt-5 w-full rounded-full bg-gradient-to-r from-brand-violet to-brand-cyan text-white shadow-[0_0_30px_-10px_var(--brand-violet)] hover:opacity-90"
      >
        Continue to book
      </Button>
      <p className="mt-3 text-center text-xs text-muted-foreground">{studio.availabilityNote} · free cancellation 48h out</p>
    </Card>
  );
}
