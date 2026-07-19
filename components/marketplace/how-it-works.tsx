import Image from "next/image";
import { Calendar, Search, Sparkles } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";

const steps = [
  { icon: Search, title: "Browse & filter", text: "Search by category, city, price, and gear — see real availability before you commit." },
  { icon: Calendar, title: "Pick a slot & book", text: "Choose a time, add any equipment or crew, and confirm instantly. No back-and-forth." },
  { icon: Sparkles, title: "Show up & create", text: "Self check-in, everything pre-set. Your session starts the second you walk in." },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <Reveal className="mx-auto mb-14 max-w-2xl text-center">
        <p className="text-sm font-medium text-brand-cyan">How it works</p>
        <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          From idea to booked in under a minute
        </h2>
      </Reveal>

      <div className="relative overflow-hidden rounded-3xl ring-1 ring-foreground/10">
        <div className="relative h-72 w-full sm:h-96">
          <Image
            src="https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=1600&q=80&auto=format&fit=crop"
            alt="Creative studio space"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />
        </div>

        <div className="relative -mt-24 grid grid-cols-1 gap-4 px-6 pb-8 sm:grid-cols-3 sm:px-8">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.1}>
              <div className="flex h-full flex-col gap-3 rounded-2xl bg-card/90 p-6 ring-1 ring-foreground/10 backdrop-blur">
                <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-violet to-brand-cyan text-white">
                  <step.icon className="size-5" />
                </div>
                <p className="font-heading font-medium">
                  <span className="mr-2 text-muted-foreground">0{i + 1}</span>
                  {step.title}
                </p>
                <p className="text-sm text-muted-foreground">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
