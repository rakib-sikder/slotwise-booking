"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight, LayoutDashboard } from "lucide-react";

import { LogoMark } from "@/components/logo-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .from("[data-reveal='logo']", { opacity: 0, y: -8, duration: 0.4 })
        .from("[data-reveal='h1']", { opacity: 0, y: 14, duration: 0.55 }, "-=0.2")
        .from("[data-reveal='sub']", { opacity: 0, y: 10, duration: 0.5 }, "-=0.35")
        .from("[data-reveal='cta']", { opacity: 0, y: 10, duration: 0.4 }, "-=0.3")
        .from("[data-reveal='foot']", { opacity: 0, duration: 0.4 }, "-=0.2");
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="flex items-center justify-between px-6 py-5">
        <div data-reveal="logo">
          <LogoMark />
        </div>
        <ThemeToggle />
      </header>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-xl text-center space-y-6">
          <h1 data-reveal="h1" className="text-4xl font-semibold tracking-tight">
            Booking, without the back-and-forth.
          </h1>
          <p data-reveal="sub" className="text-muted-foreground">
            Set your services and working hours once. Share one link. Clients book themselves
            into real, conflict-free slots — no back-and-forth, no double-bookings.
          </p>
          <div data-reveal="cta" className="flex items-center justify-center gap-3 pt-2">
            <Button size="lg" className="rounded-full" render={<Link href="/book" />}>
              Try the booking page
              <ArrowRight className="size-4" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full" render={<Link href="/admin" />}>
              <LayoutDashboard className="size-4" />
              Owner dashboard
            </Button>
          </div>
          <p data-reveal="foot" className="text-xs text-muted-foreground pt-4">
            Demo data: &ldquo;Blue Willow Salon&rdquo;. Owner dashboard is password-protected —
            the demo password is shown on the login screen.
          </p>
        </div>
      </div>
    </div>
  );
}
