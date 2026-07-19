"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";

const SECTION_LABEL: Record<string, string> = {
  "/admin": "Overview",
  "/admin/availability": "Availability",
  "/admin/appointments": "Appointments",
  "/admin/settings": "Settings",
};

export function TopBar() {
  const pathname = usePathname();
  const section = SECTION_LABEL[pathname] ?? "Overview";

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur px-6 h-14">
      <p className="text-sm text-muted-foreground">
        Dashboard <span className="mx-1.5">›</span> <span className="text-foreground">{section}</span>
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" render={<Link href="/book" target="_blank" />}>
          <ExternalLink className="size-3.5" />
          Booking page
        </Button>
        <Button size="sm" render={<Link href="/admin/settings" />}>
          <Settings2 className="size-3.5" />
          Booking settings
        </Button>
        <div className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold ml-1">
          S
        </div>
      </div>
    </div>
  );
}
