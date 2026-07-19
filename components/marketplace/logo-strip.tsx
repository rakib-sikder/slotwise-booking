import { clientLogos } from "@/lib/marketplace-data";
import { Reveal } from "@/components/motion/reveal";

export function LogoStrip() {
  return (
    <section className="border-y border-border py-12">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mb-8 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Trusted by creators from
        </Reveal>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60 grayscale">
          {clientLogos.map((name) => (
            <span key={name} className="font-heading text-lg font-semibold tracking-tight">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
