import { Star } from "lucide-react";
import type { StudioReview } from "@/lib/marketplace-data";
import { Reveal } from "@/components/motion/reveal";

export function StudioReviews({ reviews }: { reviews: StudioReview[] }) {
  if (reviews.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {reviews.map((review, i) => (
        <Reveal key={`${review.author}-${review.date}`} delay={i * 0.05}>
          <div className="rounded-2xl bg-card p-5 ring-1 ring-foreground/10">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{review.author}</p>
              <span className="flex items-center gap-0.5">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} className="size-3 fill-brand-violet text-brand-violet" />
                ))}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{review.text}</p>
            <p className="mt-3 text-xs text-muted-foreground/70">
              {new Date(review.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
