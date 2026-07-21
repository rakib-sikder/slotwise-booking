"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarCheck, Clock } from "lucide-react";
import { LogoMark } from "@/components/logo-mark";
import type { Service } from "@/lib/types";
import { cn } from "@/lib/utils";

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function minutesToLabel(minutes: number): string {
  const h24 = Math.floor(minutes / 60);
  const m = minutes % 60;
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

const days = Array.from({ length: 14 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return { value: toDateStr(d), label: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) };
});

const pill = (active: boolean) =>
  cn(
    "rounded-full px-4 py-2 text-sm border transition-colors",
    active
      ? "bg-primary border-primary text-primary-foreground shadow-sm"
      : "border-border bg-card text-foreground hover:border-primary/50"
  );

export default function BookPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState<string>("");
  const [date, setDate] = useState(days[0].value);
  const [slots, setSlots] = useState<number[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<{ date: string; slot: number; serviceName: string } | null>(null);

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((data: Service[]) => {
        setServices(data);
        if (data[0]) setServiceId(data[0].id);
      });
  }, []);

  const loadSlots = useCallback(() => {
    if (!serviceId) return;
    setLoadingSlots(true);
    setSelectedSlot(null);
    fetch(`/api/slots?date=${date}&serviceId=${serviceId}`)
      .then((r) => r.json())
      .then((data) => setSlots(data.slots ?? []))
      .finally(() => setLoadingSlots(false));
  }, [date, serviceId]);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  const selectedService = useMemo(() => services.find((s) => s.id === serviceId), [services, serviceId]);
  const selectedDay = useMemo(() => days.find((d) => d.value === date), [date]);

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSlot == null || !selectedService) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          date,
          startMinutes: selectedSlot,
          customerName: form.name,
          customerEmail: form.email,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        loadSlots();
        return;
      }
      setConfirmed({ date, slot: selectedSlot, serviceName: selectedService.name });
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-6">
        <div className="max-w-md w-full text-center space-y-4 rounded-2xl border border-border bg-card p-10 shadow-sm">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CalendarCheck className="size-6" />
          </div>
          <h1 className="font-heading text-2xl font-semibold">You&apos;re booked</h1>
          <p className="text-muted-foreground">
            {confirmed.serviceName} on {confirmed.date} at {minutesToLabel(confirmed.slot)}
          </p>
          <button
            onClick={() => setConfirmed(null)}
            className="mt-2 text-sm rounded-full border border-border px-5 py-2 transition-colors hover:border-primary/50"
          >
            Book another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/60 backdrop-blur-sm">
        <div className="mx-auto max-w-2xl px-6 py-4 flex items-center gap-2.5">
          <Link href="/" aria-label="Slotwise home">
            <LogoMark className="font-heading text-base" />
          </Link>
          <span className="text-muted-foreground text-sm ml-auto">Blue Willow Salon</span>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-10 space-y-8">
        <header>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">Book an appointment</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Pick a service and a time — the slot is confirmed server-side, so it can&apos;t be
            double-booked.
          </p>
        </header>

        <section>
          <h2 className="text-sm font-medium mb-2.5 text-muted-foreground">Service</h2>
          <div className="flex flex-wrap gap-2">
            {services.map((s) => (
              <button key={s.id} onClick={() => setServiceId(s.id)} className={pill(s.id === serviceId)}>
                {s.name} · {s.durationMinutes}min{s.price ? ` · $${s.price}` : ""}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium mb-2.5 text-muted-foreground">Date</h2>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {days.map((d) => (
              <button
                key={d.value}
                onClick={() => setDate(d.value)}
                suppressHydrationWarning
                className={cn(
                  "shrink-0 rounded-lg px-3 py-2 text-xs border transition-colors",
                  d.value === date
                    ? "bg-primary border-primary text-primary-foreground shadow-sm"
                    : "border-border bg-card hover:border-primary/50"
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium mb-2.5 text-muted-foreground">Available times</h2>
          {loadingSlots ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2" aria-hidden>
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="h-9 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : slots.length === 0 ? (
            <p className="text-sm text-muted-foreground">No availability this day — try another date.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSlot(s)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm border transition-colors tabular-nums",
                    s === selectedSlot
                      ? "bg-primary border-primary text-primary-foreground shadow-sm"
                      : "border-border bg-card hover:border-primary/50"
                  )}
                >
                  {minutesToLabel(s)}
                </button>
              ))}
            </div>
          )}
        </section>

        {selectedSlot != null && selectedService && (
          <form
            onSubmit={submitBooking}
            className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-heading font-semibold">Your details</h2>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="size-3.5" aria-hidden />
                  {selectedService.name} · {selectedDay?.label} · {minutesToLabel(selectedSlot)}
                </p>
              </div>
              {selectedService.price ? (
                <span className="rounded-full bg-primary/10 text-primary text-sm font-medium px-3 py-1">
                  ${selectedService.price}
                </span>
              ) : null}
            </div>
            <input
              required
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-primary"
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-primary"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-primary text-primary-foreground text-sm font-medium px-4 py-2.5 transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Booking…" : `Confirm ${minutesToLabel(selectedSlot)}`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
