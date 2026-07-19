"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { animate, stagger } from "animejs";
import { CheckCircle2 } from "lucide-react";

import type { Service } from "@/lib/types";
import { LogoMark } from "@/components/logo-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  return { value: toDateStr(d), label: d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }) };
});

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
  const slotGridRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLFormElement>(null);
  const confirmRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (slotGridRef.current && slots.length) {
      animate(slotGridRef.current.children, {
        opacity: [0, 1],
        y: [10, 0],
        duration: 320,
        delay: stagger(25),
        ease: "outQuad",
      });
    }
  }, [slots]);

  useGSAP(
    () => {
      if (detailsRef.current) {
        gsap.from(detailsRef.current, { opacity: 0, y: 16, duration: 0.4, ease: "power3.out" });
      }
    },
    { dependencies: [selectedSlot], scope: detailsRef }
  );

  useGSAP(
    () => {
      if (confirmRef.current) {
        gsap.from(confirmRef.current.children, {
          opacity: 0,
          y: 14,
          duration: 0.5,
          stagger: 0.08,
          ease: "back.out(1.7)",
        });
      }
    },
    { dependencies: [confirmed], scope: confirmRef }
  );

  const selectedService = useMemo(() => services.find((s) => s.id === serviceId), [services, serviceId]);

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
        <div ref={confirmRef} className="max-w-md text-center space-y-3">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent text-primary">
            <CheckCircle2 className="size-7" />
          </div>
          <h1 className="text-2xl font-semibold">You&apos;re booked</h1>
          <p className="text-muted-foreground">
            {confirmed.serviceName} on {confirmed.date} at {minutesToLabel(confirmed.slot)}
          </p>
          <Button variant="outline" className="mt-4 rounded-full" onClick={() => setConfirmed(null)}>
            Book another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-6 py-12 space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <LogoMark className="text-base" />
            <p className="text-muted-foreground text-sm mt-1">Book an appointment — Blue Willow Salon</p>
          </div>
        </header>

        <section>
          <h2 className="text-sm font-medium mb-2 text-muted-foreground">Service</h2>
          <div className="flex flex-wrap gap-2">
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => setServiceId(s.id)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm border transition-colors",
                  s.id === serviceId
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-border hover:border-primary/40 hover:bg-accent"
                )}
              >
                {s.name} · {s.durationMinutes}min{s.price ? ` · $${s.price}` : ""}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium mb-2 text-muted-foreground">Date</h2>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {days.map((d) => (
              <button
                key={d.value}
                onClick={() => setDate(d.value)}
                className={cn(
                  "shrink-0 rounded-lg px-3 py-2 text-xs border transition-colors",
                  d.value === date
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-border hover:border-primary/40 hover:bg-accent"
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium mb-2 text-muted-foreground">Available times</h2>
          {loadingSlots ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : slots.length === 0 ? (
            <p className="text-sm text-muted-foreground">No availability this day — try another date.</p>
          ) : (
            <div ref={slotGridRef} className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSlot(s)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm border transition-colors",
                    s === selectedSlot
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-border hover:border-primary/40 hover:bg-accent"
                  )}
                >
                  {minutesToLabel(s)}
                </button>
              ))}
            </div>
          )}
        </section>

        {selectedSlot != null && (
          <form ref={detailsRef} onSubmit={submitBooking} className="rounded-xl border border-border p-5 space-y-3">
            <h2 className="font-medium">Your details</h2>
            <Input
              required
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={submitting} className="rounded-lg">
              {submitting ? "Booking…" : `Confirm ${minutesToLabel(selectedSlot)}`}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
