import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Check, MapPin, Star, Users } from "lucide-react";

import { studios, getStudioBySlug, getSimilarStudios, getReviewsForStudio, CATEGORY_LABELS } from "@/lib/marketplace-data";
import { StudioGallery } from "@/components/marketplace/studio-gallery";
import { StudioSidebar } from "@/components/marketplace/studio-sidebar";
import { StudioMap } from "@/components/marketplace/studio-map";
import { StudioReviews } from "@/components/marketplace/studio-reviews";
import { StudioCard } from "@/components/marketplace/studio-card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

export function generateStaticParams() {
  return studios.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const studio = getStudioBySlug(slug);
  if (!studio) return {};
  return { title: `${studio.name} — Slotwise`, description: studio.tagline };
}

export default async function StudioDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const studio = getStudioBySlug(slug);
  if (!studio) notFound();

  const similar = getSimilarStudios(studio);
  const reviews = getReviewsForStudio(studio.id);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/studios" className="hover:text-foreground">Studios</Link>
        <span>/</span>
        <Link href={`/studios?category=${studio.category}`} className="hover:text-foreground">{CATEGORY_LABELS[studio.category]}</Link>
        <span>/</span>
        <span className="text-foreground">{studio.name}</span>
      </div>

      <Reveal>
        <StudioGallery images={studio.images} name={studio.name} />
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Reveal>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Badge variant="secondary">{CATEGORY_LABELS[studio.category]}</Badge>
                <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">{studio.name}</h1>
                <p className="mt-2 text-muted-foreground">{studio.tagline}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="size-4 fill-brand-violet text-brand-violet" /> {studio.rating} ({studio.reviewCount} reviews)
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="size-4" /> {studio.city}
              </span>
              <span className="flex items-center gap-1">
                <Users className="size-4" /> Up to {studio.capacity} people · {studio.sqft.toLocaleString("en-US")} sq ft
              </span>
            </div>
          </Reveal>

          <Separator className="my-8" />

          <Reveal>
            <h2 className="font-heading text-xl font-medium">About this studio</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{studio.description}</p>
          </Reveal>

          <Separator className="my-8" />

          <Reveal>
            <h2 className="font-heading text-xl font-medium">Amenities</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {studio.amenities.map((a) => (
                <span key={a} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="size-4 text-brand-cyan" /> {a}
                </span>
              ))}
            </div>
          </Reveal>

          <Separator className="my-8" />

          <Reveal>
            <h2 className="font-heading text-xl font-medium">What&apos;s included</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {studio.equipment.map((e) => (
                <Badge key={e} variant="outline">{e}</Badge>
              ))}
            </div>
          </Reveal>

          <Separator className="my-8" />

          <Reveal>
            <h2 className="font-heading text-xl font-medium">Location</h2>
            <div className="mt-4">
              <StudioMap address={studio.address} city={studio.city} />
            </div>
          </Reveal>

          <Separator className="my-8" />

          <Reveal>
            <h2 className="font-heading text-xl font-medium">Reviews</h2>
            <div className="mt-4">
              <StudioReviews reviews={reviews} />
              {reviews.length === 0 && <p className="text-sm text-muted-foreground">No reviews yet — be the first to book.</p>}
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-1">
          <StudioSidebar studio={studio} />
        </div>
      </div>

      {similar.length > 0 && (
        <div className="mt-16">
          <Reveal className="mb-6">
            <h2 className="font-heading text-2xl font-semibold tracking-tight">Similar studios</h2>
          </Reveal>
          <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((s) => (
              <RevealItem key={s.id}>
                <StudioCard studio={s} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      )}
    </div>
  );
}
