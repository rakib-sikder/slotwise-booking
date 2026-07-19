import { Counter } from "@/components/motion/counter";
import { Reveal } from "@/components/motion/reveal";
import { platformStats } from "@/lib/marketplace-data";

export function StatsBar() {
  return (
    <section className="border-y border-border bg-card/30">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 py-14 md:grid-cols-4">
        {platformStats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08} className="text-center">
            <p className="font-heading text-4xl font-semibold sm:text-5xl">
              <Counter value={stat.value} suffix={stat.suffix} decimals={stat.decimals ?? 0} />
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
