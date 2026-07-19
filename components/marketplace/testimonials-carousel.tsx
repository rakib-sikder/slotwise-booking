"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

import { testimonials } from "@/lib/marketplace-data";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  const go = (dir: 1 | -1) => {
    setDirection(dir);
    setIndex((i) => (i + dir + testimonials.length) % testimonials.length);
  };

  const current = testimonials[index];

  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <Reveal className="mb-12 text-center">
        <p className="text-sm font-medium text-brand-cyan">Loved by creators</p>
        <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">What people are saying</h2>
      </Reveal>

      <div className="relative min-h-[220px]">
        <Quote className="mx-auto mb-4 size-8 text-brand-violet/40" />
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 40 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
            className="text-center"
          >
            <p className="text-balance font-heading text-xl leading-relaxed sm:text-2xl">&ldquo;{current.quote}&rdquo;</p>
            <div className="mt-6 flex items-center justify-center gap-1">
              {Array.from({ length: current.rating }).map((_, i) => (
                <Star key={i} className="size-4 fill-brand-violet text-brand-violet" />
              ))}
            </div>
            <p className="mt-3 text-sm font-medium">{current.author}</p>
            <p className="text-xs text-muted-foreground">{current.role}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <Button variant="outline" size="icon" className="rounded-full" onClick={() => go(-1)} aria-label="Previous testimonial">
          <ChevronLeft className="size-4" />
        </Button>
        <div className="flex items-center gap-1.5">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              className={cn("h-1.5 rounded-full transition-all", i === index ? "w-6 bg-brand-violet" : "w-1.5 bg-muted-foreground/30")}
            />
          ))}
        </div>
        <Button variant="outline" size="icon" className="rounded-full" onClick={() => go(1)} aria-label="Next testimonial">
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </section>
  );
}
