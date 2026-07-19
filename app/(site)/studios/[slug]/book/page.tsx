import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getStudioBySlug } from "@/lib/marketplace-data";
import { BookingFlow } from "@/components/marketplace/booking-flow";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const studio = getStudioBySlug(slug);
  if (!studio) return {};
  return { title: `Book ${studio.name} — Slotwise` };
}

export default async function BookStudioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const studio = getStudioBySlug(slug);
  if (!studio) notFound();

  return (
    <Suspense>
      <BookingFlow studio={studio} />
    </Suspense>
  );
}
