"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, Clock, Inbox, LogOut, Settings } from "lucide-react";

import { LogoMark } from "@/components/logo-mark";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: CalendarDays },
  { href: "/admin/availability", label: "Availability", icon: Clock },
  { href: "/admin/appointments", label: "Appointments", icon: Inbox },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AppSidebar({ businessName }: { businessName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="px-5 py-5">
        <LogoMark />
        <p className="mt-3 text-xs text-muted-foreground">Workspace</p>
        <p className="text-sm font-medium truncate">{businessName}</p>
      </div>
      <Separator />
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3">
        <Button variant="ghost" className="w-full justify-start" onClick={logout}>
          <LogOut className="size-4" />
          Log out
        </Button>
      </div>
    </aside>
  );
}
