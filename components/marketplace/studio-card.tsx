"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Star, Users } from "lucide-react";

import type { Studio } from "@/lib/marketplace-data";
import { CATEGORY_LABELS } from "@/lib/marketplace-data";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function StudioCard({ studio, variant = "grid" }: { studio: Studio; variant?: "grid" | "list" }) {
  if (variant === "list") {
    return (
      <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
        <Link
          href={`/studios/${studio.slug}`}
          className="group flex flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10 transition-shadow hover:shadow-[0_0_0_1px_var(--brand-violet),0_12px_40px_-16px_var(--brand-violet)] sm:flex-row"
        >
          <div className="relative h-48 w-full shrink-0 overflow-hidden sm:h-auto sm:w-64">
            <Image
              src={studio.images[0]}
              alt={studio.name}
              fill
              sizes="256px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <Badge className="absolute left-3 top-3 bg-black/60 text-white backdrop-blur">
              {CATEGORY_LABELS[studio.category]}
            </Badge>
          </div>
          <div className="flex flex-1 flex-col justify-between p-5">
            <div>
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-heading text-lg font-medium">{studio.name}</h3>
                <div className="flex shrink-0 items-center gap-1 text-sm">
                  <Star className="size-3.5 fill-brand-violet text-brand-violet" />
                  <span className="font-medium">{studio.rating}</span>
                  <span className="text-muted-foreground">({studio.reviewCount})</span>
                </div>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{studio.tagline}</p>
              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5" /> {studio.city}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="size-3.5" /> Up to {studio.capacity}
                </span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm">
                <span className="font-heading text-lg font-semibold">${studio.pricePerHour}</span>
                <span className="text-muted-foreground"> / hour</span>
              </p>
              <span className="text-xs text-brand-cyan">{studio.availabilityNote}</span>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
      <Link
        href={`/studios/${studio.slug}`}
        className={cn(
          "group relative flex flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10 transition-all duration-300",
          "hover:-translate-y-1 hover:shadow-[0_0_0_1px_var(--brand-violet),0_20px_50px_-20px_var(--brand-violet)]"
        )}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={studio.images[0]}
            alt={studio.name}
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
          <Badge className="absolute left-3 top-3 bg-black/60 text-white backdrop-blur">
            {CATEGORY_LABELS[studio.category]}
          </Badge>
          {studio.featured && (
            <Badge className="absolute right-3 top-3 bg-gradient-to-r from-brand-violet to-brand-cyan text-white">
              Featured
            </Badge>
          )}
          <div className="absolute inset-x-3 bottom-3 flex items-center justify-between text-white">
            <span className="flex items-center gap-1 text-xs">
              <MapPin className="size-3.5" /> {studio.city}
            </span>
            <span className="flex items-center gap-1 text-xs font-medium">
              <Star className="size-3.5 fill-white" /> {studio.rating}
            </span>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="font-heading font-medium leading-snug">{studio.name}</h3>
          <p className="line-clamp-1 text-sm text-muted-foreground">{studio.tagline}</p>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-sm">
              <span className="font-heading text-base font-semibold">${studio.pricePerHour}</span>
              <span className="text-muted-foreground"> /hr</span>
            </p>
            <span
              className="translate-x-1 text-xs font-medium text-brand-cyan opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
            >
              View studio →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
