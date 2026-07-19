"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { Booking, Service } from "@/lib/types";
import { minutesToLabel, toDateStr, DAY_NAMES_SHORT } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function startOfWeek(d: Date): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() - copy.getDay());
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export default function AppointmentsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));

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

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    }),
    [weekStart]
  );

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

  const sorted = [...bookings].sort((a, b) => (a.date + a.startMinutes).localeCompare(b.date + b.startMinutes));
  const todayStr = toDateStr(new Date());

  return (
    <div className="p-8 space-y-8">
      <header>
        <p className="text-sm text-muted-foreground">Appointments</p>
        <h1 className="text-2xl font-semibold tracking-tight">Schedule</h1>
        <p className="text-sm text-muted-foreground mt-1">Weekly view of confirmed client time.</p>
      </header>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={() => setWeekStart((d) => { const n = new Date(d); n.setDate(n.getDate() - 7); return n; })}>
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setWeekStart((d) => { const n = new Date(d); n.setDate(n.getDate() + 7); return n; })}>
              <ChevronRight className="size-4" />
            </Button>
            <Button variant="outline" size="sm" className="ml-1" onClick={() => setWeekStart(startOfWeek(new Date()))}>
              Today
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {weekDays[0].toLocaleDateString(undefined, { month: "short", day: "numeric" })} –{" "}
            {weekDays[6].toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          </p>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((d, i) => {
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
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
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
