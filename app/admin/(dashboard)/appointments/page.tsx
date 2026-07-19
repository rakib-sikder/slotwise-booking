"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { Booking, Service } from "@/lib/types";
import { minutesToLabel, toDateStr, DAY_NAMES_SHORT } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type View = "month" | "week" | "day";

function startOfWeek(d: Date): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() - copy.getDay());
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function startOfMonthGrid(d: Date): Date {
  const first = new Date(d.getFullYear(), d.getMonth(), 1);
  return startOfWeek(first);
}

export default function AppointmentsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [view, setView] = useState<View>("week");
  const [cursor, setCursor] = useState(() => new Date());

  const refresh = () => {
    fetch("/api/bookings").then((r) => r.json()).then(setBookings);
    fetch("/api/services").then((r) => r.json()).then(setServices);
  };

  useEffect(refresh, []);

  const cancelBooking = async (id: string) => {
    await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    toast.success("Booking cancelled");
    refresh();
  };

  const bookingsByDate = useMemo(() => {
    const map = new Map<string, Booking[]>();
    for (const b of bookings) {
      const list = map.get(b.date) ?? [];
      list.push(b);
      map.set(b.date, list);
    }
    for (const list of map.values()) list.sort((a, b) => a.startMinutes - b.startMinutes);
    return map;
  }, [bookings]);

  const todayStr = toDateStr(new Date());

  const step = (dir: 1 | -1) => {
    setCursor((d) => {
      const n = new Date(d);
      if (view === "month") n.setMonth(n.getMonth() + dir);
      else if (view === "week") n.setDate(n.getDate() + dir * 7);
      else n.setDate(n.getDate() + dir);
      return n;
    });
  };

  const sorted = [...bookings].sort((a, b) => (a.date + a.startMinutes).localeCompare(b.date + b.startMinutes));

  return (
    <div className="p-8 space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Appointments</p>
          <h1 className="text-2xl font-semibold tracking-tight">Schedule</h1>
          <p className="text-sm text-muted-foreground mt-1">Weekly view of confirmed client time.</p>
        </div>
        <Badge variant="secondary">{bookings.length} active</Badge>
      </header>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={() => step(-1)}>
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => step(1)}>
              <ChevronRight className="size-4" />
            </Button>
            <Button variant="outline" size="sm" className="ml-1" onClick={() => setCursor(new Date())}>
              Today
            </Button>
          </div>
          <p className="text-sm font-medium text-muted-foreground" suppressHydrationWarning>
            <CalendarLabel view={view} cursor={cursor} />
          </p>
          <div className="inline-flex rounded-lg border border-border p-0.5">
            {(["month", "week", "day"] as View[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "px-3 py-1 text-sm rounded-md capitalize transition-colors",
                  view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {view === "week" && <WeekView cursor={cursor} bookingsByDate={bookingsByDate} todayStr={todayStr} />}
        {view === "day" && <DayView cursor={cursor} bookingsByDate={bookingsByDate} services={services} />}
        {view === "month" && <MonthView cursor={cursor} bookingsByDate={bookingsByDate} todayStr={todayStr} />}
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-medium">All appointments ({bookings.length})</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((b) => {
              const service = services.find((s) => s.id === b.serviceId);
              return (
                <TableRow key={b.id}>
                  <TableCell>
                    <p className="font-medium">{b.customerName}</p>
                    <p className="text-xs text-muted-foreground">{b.customerEmail}</p>
                  </TableCell>
                  <TableCell>{service?.name ?? "—"}</TableCell>
                  <TableCell>{b.date}</TableCell>
                  <TableCell>{minutesToLabel(b.startMinutes)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Confirmed</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <button onClick={() => cancelBooking(b.id)} className="text-destructive text-sm hover:underline">
                      Cancel
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
            {sorted.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No appointments yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function CalendarLabel({ view, cursor }: { view: View; cursor: Date }) {
  if (view === "month") return <>{cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</>;
  if (view === "day") return <>{cursor.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</>;
  const start = startOfWeek(cursor);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return (
    <>
      {start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} –{" "}
      {end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
    </>
  );
}

function WeekView({
  cursor,
  bookingsByDate,
  todayStr,
}: {
  cursor: Date;
  bookingsByDate: Map<string, Booking[]>;
  todayStr: string;
}) {
  const start = startOfWeek(cursor);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((d, i) => {
        const dateStr = toDateStr(d);
        const dayBookings = bookingsByDate.get(dateStr) ?? [];
        const isToday = dateStr === todayStr;
        return (
          <div key={dateStr} className={cn("rounded-lg border border-border p-2 min-h-32", isToday && "border-primary/50 bg-accent/40")}>
            <p className={cn("text-xs font-medium mb-1.5", isToday ? "text-primary" : "text-muted-foreground")}>
              {DAY_NAMES_SHORT[i]} {d.getDate()}
            </p>
            <div className="space-y-1">
              {dayBookings.map((b) => (
                <div key={b.id} className="rounded bg-accent px-1.5 py-1 text-[11px] leading-tight text-accent-foreground truncate">
                  {minutesToLabel(b.startMinutes)} · {b.customerName}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DayView({
  cursor,
  bookingsByDate,
  services,
}: {
  cursor: Date;
  bookingsByDate: Map<string, Booking[]>;
  services: Service[];
}) {
  const dateStr = toDateStr(cursor);
  const dayBookings = bookingsByDate.get(dateStr) ?? [];

  return (
    <div className="space-y-2">
      {dayBookings.length === 0 && <p className="text-sm text-muted-foreground py-6 text-center">Nothing booked this day.</p>}
      {dayBookings.map((b) => {
        const service = services.find((s) => s.id === b.serviceId);
        return (
          <div key={b.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm">
            <div>
              <p className="font-medium">{b.customerName}</p>
              <p className="text-muted-foreground">{service?.name ?? "Service"}</p>
            </div>
            <p className="font-medium">{minutesToLabel(b.startMinutes)}</p>
          </div>
        );
      })}
    </div>
  );
}

function MonthView({
  cursor,
  bookingsByDate,
  todayStr,
}: {
  cursor: Date;
  bookingsByDate: Map<string, Booking[]>;
  todayStr: string;
}) {
  const gridStart = startOfMonthGrid(cursor);
  const days = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(d.getDate() + i);
    return d;
  });
  const currentMonth = cursor.getMonth();

  return (
    <div className="grid grid-cols-7 gap-1.5">
      {DAY_NAMES_SHORT.map((d) => (
        <p key={d} className="text-xs font-medium text-muted-foreground text-center pb-1">
          {d}
        </p>
      ))}
      {days.map((d) => {
        const dateStr = toDateStr(d);
        const count = bookingsByDate.get(dateStr)?.length ?? 0;
        const isToday = dateStr === todayStr;
        const inMonth = d.getMonth() === currentMonth;
        return (
          <div
            key={dateStr}
            className={cn(
              "rounded-lg border border-border p-1.5 min-h-16 text-xs",
              isToday && "border-primary/50 bg-accent/40",
              !inMonth && "opacity-40"
            )}
          >
            <p className={cn(isToday && "text-primary font-medium")}>{d.getDate()}</p>
            {count > 0 && (
              <Badge variant="secondary" className="mt-1 text-[10px] px-1.5 py-0">
                {count} booked
              </Badge>
            )}
          </div>
        );
      })}
    </div>
  );
}
