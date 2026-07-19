import type { Metadata } from "next";

import { Hero } from "@/components/marketplace/hero";
import { StatsBar } from "@/components/marketplace/stats-bar";
import { FeaturedStudios } from "@/components/marketplace/featured-studios";
import { HowItWorks } from "@/components/marketplace/how-it-works";
import { LogoStrip } from "@/components/marketplace/logo-strip";
import { TestimonialsCarousel } from "@/components/marketplace/testimonials-carousel";
import { FaqSection } from "@/components/marketplace/faq-section";
import { FinalCta } from "@/components/marketplace/final-cta";

export const metadata: Metadata = {
  title: "Slotwise — Book Creative Spaces That Inspire",
  description: "Browse photography, podcast, video, and music studios with real-time availability, and book in minutes.",
};

export default function Home() {
  return (
    <>
      <Hero />
      <StatsBar />
      <FeaturedStudios />
      <HowItWorks />
      <LogoStrip />
      <TestimonialsCarousel />
      <FaqSection />
      <FinalCta />
    </>
  );
}
