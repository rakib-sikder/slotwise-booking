"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutGrid, List, Search, SlidersHorizontal } from "lucide-react";

import { studios, CATEGORY_LABELS, type StudioCategory } from "@/lib/marketplace-data";
import { StudioCard } from "@/components/marketplace/studio-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type CategoryFilter = "all" | StudioCategory;
type SortKey = "recommended" | "price-asc" | "price-desc" | "rating";

const categories: CategoryFilter[] = ["all", "photo", "podcast", "video", "music"];

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Highest rated" },
];

export function StudiosBrowser() {
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get("category") as CategoryFilter) ?? "all";

  const [category, setCategory] = useState<CategoryFilter>(
    categories.includes(initialCategory) ? initialCategory : "all"
  );
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("recommended");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    let list = studios.filter((s) => (category === "all" ? true : s.category === category));
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (s) => s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q) || s.tagline.toLowerCase().includes(q)
      );
    }
    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.pricePerHour - b.pricePerHour);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.pricePerHour - a.pricePerHour);
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      default:
        list = [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    }
    return list;
  }, [category, query, sort]);

  const FilterPills = (
    <div className="flex flex-wrap gap-2">
      {categories.map((c) => (
        <button
          key={c}
          onClick={() => setCategory(c)}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
            category === c
              ? "border-transparent bg-gradient-to-r from-brand-violet to-brand-cyan text-white"
              : "border-border text-muted-foreground hover:border-brand-violet/40 hover:text-foreground"
          )}
        >
          {c === "all" ? "All studios" : CATEGORY_LABELS[c]}
        </button>
      ))}
    </div>
  );

  return (
    <div>
      {/* Desktop filter row */}
      <div className="hidden items-center justify-between gap-4 md:flex">
        {FilterPills}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or city"
              className="w-56 pl-9"
            />
          </div>
          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              {sortOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center rounded-lg border border-border p-0.5">
            <Button variant={view === "grid" ? "secondary" : "ghost"} size="icon-sm" onClick={() => setView("grid")} aria-label="Grid view">
              <LayoutGrid className="size-4" />
            </Button>
            <Button variant={view === "list" ? "secondary" : "ghost"} size="icon-sm" onClick={() => setView("list")} aria-label="List view">
              <List className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile filter row */}
      <div className="flex items-center gap-2 md:hidden">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search studios" className="pl-9" />
        </div>
        <Sheet>
          <SheetTrigger render={<Button variant="outline" size="icon" />}>
            <SlidersHorizontal className="size-4" />
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl">
            <SheetTitle>Filters</SheetTitle>
            <div className="flex flex-col gap-5 px-1 pb-4">
              {FilterPills}
              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {sortOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2 rounded-lg border border-border p-0.5">
                <Button variant={view === "grid" ? "secondary" : "ghost"} className="flex-1" onClick={() => setView("grid")}>
                  <LayoutGrid className="size-4" /> Grid
                </Button>
                <Button variant={view === "list" ? "secondary" : "ghost"} className="flex-1" onClick={() => setView("list")}>
                  <List className="size-4" /> List
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">{filtered.length} studios found</p>

      <motion.div
        key={`${category}-${sort}-${query}-${view}`}
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.05 }}
        className={cn(
          "mt-6",
          view === "grid" ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col gap-4"
        )}
      >
        {filtered.map((studio) => (
          <StudioCard key={studio.id} studio={studio} variant={view} />
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <div className="mt-16 flex flex-col items-center gap-2 text-center text-muted-foreground">
          <p className="font-medium">No studios match your filters</p>
          <p className="text-sm">Try a different category or search term.</p>
        </div>
      )}
    </div>
  );
}
