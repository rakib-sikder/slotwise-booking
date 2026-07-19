"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarCheck2, Clock3, ListChecks } from "lucide-react";

import type { Booking, Service } from "@/lib/types";
import { minutesToLabel, toDateStr } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DashboardOverviewPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetch("/api/bookings").then((r) => r.json()).then(setBookings);
    fetch("/api/services").then((r) => r.json()).then(setServices);
  }, []);

  const todayStr = toDateStr(new Date());
  const weekAhead = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return toDateStr(d);
  }, []);

  const upcomingThisWeek = bookings.filter((b) => b.date >= todayStr && b.date <= weekAhead).length;

  const upcoming = [...bookings]
    .sort((a, b) => (a.date + a.startMinutes).localeCompare(b.date + b.startMinutes))
    .slice(0, 5);

  return (
    <div className="p-8 space-y-8">
      <header>
        <p className="text-sm text-muted-foreground">Dashboard</p>
        <h1 className="text-2xl font-semibold tracking-tight">Scheduling overview</h1>
      </header>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <CalendarCheck2 className="size-4" />
            Active bookings
          </div>
          <p className="text-3xl font-semibold">{bookings.length}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <Clock3 className="size-4" />
            Next 7 days
          </div>
          <p className="text-3xl font-semibold">{upcomingThisWeek}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <ListChecks className="size-4" />
            Services offered
          </div>
          <p className="text-3xl font-semibold">{services.length}</p>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="font-medium">Upcoming appointments</h2>
            <p className="text-sm text-muted-foreground">The next confirmed client sessions.</p>
          </div>
          <Link href="/admin/appointments" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="divide-y divide-border">
          {upcoming.length === 0 && (
            <p className="px-5 py-6 text-sm text-muted-foreground">No upcoming appointments yet.</p>
          )}
          {upcoming.map((b) => {
            const service = services.find((s) => s.id === b.serviceId);
            return (
              <div key={b.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <div>
                  <p className="font-medium">{b.customerName}</p>
                  <p className="text-muted-foreground">{service?.name ?? "Service"}</p>
                </div>
                <div className="text-right">
                  <p>{b.date}</p>
                  <p className="text-muted-foreground">{minutesToLabel(b.startMinutes)}</p>
                </div>
                <Badge variant="secondary">{b.date === todayStr ? "Today" : "Upcoming"}</Badge>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
