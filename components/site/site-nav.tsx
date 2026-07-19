"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { LogoMark } from "@/components/logo-mark";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const links = [
  { href: "/studios", label: "Studios" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300",
        scrolled ? "bg-background/75 backdrop-blur-lg border-b border-border" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="shrink-0">
          <LogoMark />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground",
                pathname === link.href ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" render={<Link href="/admin" />} className="text-sm text-muted-foreground">
            Studio owner login
          </Button>
          <Button
            render={<Link href="/studios" />}
            className="rounded-full bg-gradient-to-r from-brand-violet to-brand-cyan text-white shadow-[0_0_24px_-6px_var(--brand-violet)] hover:opacity-90"
          >
            Book Now
          </Button>
        </div>

        <Sheet>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <div className="mt-10 flex flex-col gap-6 px-2">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="text-lg font-medium">
                  {link.label}
                </Link>
              ))}
              <Link href="/admin" className="text-sm text-muted-foreground">
                Studio owner login
              </Link>
              <Button render={<Link href="/studios" />} className="mt-2 rounded-full bg-gradient-to-r from-brand-violet to-brand-cyan text-white">
                Book Now
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
