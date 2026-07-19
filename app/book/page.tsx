"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Service } from "@/lib/types";

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
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 px-6">
        <div className="max-w-md text-center space-y-3">
          <p className="text-3xl">✅</p>
          <h1 className="text-2xl font-semibold">You&apos;re booked</h1>
          <p className="text-neutral-500">
            {confirmed.serviceName} on {confirmed.date} at {minutesToLabel(confirmed.slot)}
          </p>
          <button
            onClick={() => setConfirmed(null)}
            className="mt-4 text-sm rounded-full border border-neutral-300 dark:border-neutral-700 px-5 py-2 hover:border-neutral-400"
          >
            Book another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <div className="mx-auto max-w-2xl px-6 py-12 space-y-8">
        <header>
          <h1 className="text-2xl font-semibold">Book an appointment</h1>
          <p className="text-neutral-500 text-sm">Blue Willow Salon</p>
        </header>

        <section>
          <h2 className="text-sm font-medium mb-2 text-neutral-500">Service</h2>
          <div className="flex flex-wrap gap-2">
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => setServiceId(s.id)}
                className={`rounded-full px-4 py-2 text-sm border transition-colors ${
                  s.id === serviceId
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-neutral-300 dark:border-neutral-700 hover:border-neutral-400"
                }`}
              >
                {s.name} · {s.durationMinutes}min{s.price ? ` · $${s.price}` : ""}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium mb-2 text-neutral-500">Date</h2>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {days.map((d) => (
              <button
                key={d.value}
                onClick={() => setDate(d.value)}
                className={`shrink-0 rounded-lg px-3 py-2 text-xs border transition-colors ${
                  d.value === date
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-neutral-300 dark:border-neutral-700 hover:border-neutral-400"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-medium mb-2 text-neutral-500">Available times</h2>
          {loadingSlots ? (
            <p className="text-sm text-neutral-400">Loading…</p>
          ) : slots.length === 0 ? (
            <p className="text-sm text-neutral-400">No availability this day — try another date.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSlot(s)}
                  className={`rounded-lg px-3 py-2 text-sm border transition-colors ${
                    s === selectedSlot
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-neutral-300 dark:border-neutral-700 hover:border-neutral-400"
                  }`}
                >
                  {minutesToLabel(s)}
                </button>
              ))}
            </div>
          )}
        </section>

        {selectedSlot != null && (
          <form onSubmit={submitBooking} className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-3">
            <h2 className="font-medium">Your details</h2>
            <input
              required
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm"
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-blue-600 text-white text-sm font-medium px-4 py-2 disabled:opacity-50"
            >
              {submitting ? "Booking…" : `Confirm ${minutesToLabel(selectedSlot)}`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
