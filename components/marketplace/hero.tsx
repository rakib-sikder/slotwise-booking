"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";

import { Button } from "@/components/ui/button";

const headline = "Book Creative Spaces That Inspire";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045 } },
};

const word = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden px-6 pt-16">
      {/* Floating gradient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-32 top-10 size-96 rounded-full bg-brand-violet/30 blur-[110px]"
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-24 top-40 size-[28rem] rounded-full bg-brand-cyan/20 blur-[120px]"
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 size-72 rounded-full bg-brand-violet/20 blur-[100px]"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur"
        >
          <span className="flex -space-x-1">
            {[0, 1, 2].map((i) => (
              <Star key={i} className="size-3 fill-brand-violet text-brand-violet" />
            ))}
          </span>
          Rated 4.9 by 500+ creators
        </motion.div>

        <motion.h1
          variants={container}
          initial="hidden"
          animate="show"
          className="text-balance font-heading text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
        >
          {headline.split(" ").map((w, i) => (
            <motion.span key={i} variants={word} className="mr-[0.28em] inline-block last:mr-0">
              {i === 2 || i === 3 ? (
                <span className="bg-gradient-to-r from-brand-violet to-brand-cyan bg-clip-text text-transparent">{w}</span>
              ) : (
                w
              )}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-6 max-w-xl text-balance text-lg text-muted-foreground"
        >
          Photography, podcast, video, and music studios — browse real-time availability and book
          the perfect space in minutes, not messages.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Button
            render={<Link href="/studios" />}
            className="h-12 rounded-full bg-gradient-to-r from-brand-violet to-brand-cyan px-8 text-base text-white shadow-[0_0_40px_-8px_var(--brand-violet)] transition-transform hover:scale-[1.03]"
          >
            Book Now
            <ArrowRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            render={<Link href="/studios" />}
            className="h-12 rounded-full border-border bg-card/40 px-8 text-base backdrop-blur hover:bg-card"
          >
            Explore Studios
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
