"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function StudioGallery({ images, name }: { images: string[]; name: string }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
  };

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl">
        <button className="group relative col-span-4 row-span-2 aspect-[16/10] sm:col-span-2" onClick={() => openAt(0)}>
          <Image src={images[0]} alt={name} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" priority />
        </button>
        {images.slice(1, 3).map((src, i) => (
          <button key={src} className="group relative col-span-2 row-span-1 hidden aspect-[4/3] sm:block" onClick={() => openAt(i + 1)}>
            <Image src={src} alt={`${name} ${i + 2}`} fill sizes="25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
            {i === 1 && images.length > 3 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-medium text-white">
                +{images.length - 3} more
              </div>
            )}
          </button>
        ))}
      </div>

      <Button variant="outline" size="sm" className="mt-3 rounded-full" onClick={() => openAt(0)}>
        <Expand className="size-3.5" /> View all photos
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl border-none bg-black/95 p-0 sm:rounded-2xl">
          <DialogTitle className="sr-only">{name} photos</DialogTitle>
          <div className="relative aspect-[16/10] w-full">
            <Image src={images[index]} alt={`${name} ${index + 1}`} fill sizes="90vw" className="object-contain" />
            {images.length > 1 && (
              <>
                <button onClick={prev} className="absolute left-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20">
                  <ChevronLeft className="size-5" />
                </button>
                <button onClick={next} className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20">
                  <ChevronRight className="size-5" />
                </button>
              </>
            )}
            <span className="absolute bottom-3 right-4 text-xs text-white/70">
              {index + 1} / {images.length}
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
