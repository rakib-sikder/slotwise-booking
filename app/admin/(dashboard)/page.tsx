"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarCheck2, Inbox, ShieldCheck, Clock3, Mail } from "lucide-react";

import type { Booking, Service, ContactMessage } from "@/lib/types";
import { minutesToLabel, toDateStr } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DashboardOverviewPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [stats, setStats] = useState({ totalRequests: 0, cancelledCount: 0 });
  const [timezone, setTimezone] = useState("");
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    fetch("/api/bookings").then((r) => r.json()).then(setBookings);
    fetch("/api/services").then((r) => r.json()).then(setServices);
    fetch("/api/settings").then((r) => r.json()).then((s) => setStats({ totalRequests: s.totalRequests, cancelledCount: s.cancelledCount }));
    fetch("/api/contact").then((r) => (r.ok ? r.json() : [])).then(setMessages);
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const todayStr = toDateStr(new Date());
  const upcoming = [...bookings]
    .sort((a, b) => (a.date + a.startMinutes).localeCompare(b.date + b.startMinutes))
    .slice(0, 5);

  return (
    <div className="p-8 space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Dashboard</p>
          <h1 className="text-2xl font-semibold tracking-tight">Scheduling overview</h1>
        </div>
        <Badge variant="secondary" className="gap-1.5 py-1.5 px-3">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Scheduling is active
        </Badge>
      </header>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <CalendarCheck2 className="size-4" />
            Active bookings
          </div>
          <p className="text-3xl font-semibold">{bookings.length}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <Inbox className="size-4" />
            Total requests
          </div>
          <p className="text-3xl font-semibold">{stats.totalRequests}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <ShieldCheck className="size-4" />
            Cancelled
          </div>
          <p className="text-3xl font-semibold">{stats.cancelledCount}</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <Clock3 className="size-4" />
            Timezone
          </div>
          <p className="text-lg font-semibold truncate">{timezone || "—"}</p>
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
                <Badge variant="secondary">{b.date === todayStr ? "Today" : "Confirmed"}</Badge>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="font-medium">Recent messages</h2>
            <p className="text-sm text-muted-foreground">Submissions from the contact form.</p>
          </div>
          <Mail className="size-4 text-muted-foreground" />
        </div>
        <div className="divide-y divide-border">
          {messages.length === 0 && (
            <p className="px-5 py-6 text-sm text-muted-foreground">No messages yet.</p>
          )}
          {messages.map((m) => (
            <div key={m.id} className="px-5 py-3 text-sm">
              <div className="flex items-center justify-between">
                <p className="font-medium">{m.name}</p>
                <p className="text-muted-foreground">{new Date(m.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
              </div>
              <p className="text-muted-foreground">{m.email}</p>
              <p className="mt-1 line-clamp-2">{m.message}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
