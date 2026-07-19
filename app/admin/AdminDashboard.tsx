"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Booking, Service, WorkingHours } from "@/lib/types";

function minutesToLabel(minutes: number): string {
  const h24 = Math.floor(minutes / 60);
  const m = minutes % 60;
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function AdminDashboard() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [hours, setHours] = useState<WorkingHours>({});
  const [newService, setNewService] = useState({ name: "", durationMinutes: "30", price: "0" });

  const refresh = () => {
    fetch("/api/bookings").then((r) => r.json()).then(setBookings);
    fetch("/api/services").then((r) => r.json()).then(setServices);
    fetch("/api/hours").then((r) => r.json()).then(setHours);
  };

  useEffect(refresh, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const cancelBooking = async (id: string) => {
    await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    refresh();
  };

  const addService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.name) return;
    await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newService.name,
        durationMinutes: Number(newService.durationMinutes),
        price: Number(newService.price),
      }),
    });
    setNewService({ name: "", durationMinutes: "30", price: "0" });
    refresh();
  };

  const removeService = async (id: string) => {
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    refresh();
  };

  const updateDay = (day: number, field: "start" | "end", value: string) => {
    setHours((prev) => {
      const ranges = prev[day]?.length ? [...prev[day]] : [{ start: "09:00", end: "17:00" }];
      ranges[0] = { ...ranges[0], [field]: value };
      return { ...prev, [day]: ranges };
    });
  };

  const toggleDay = (day: number, open: boolean) => {
    setHours((prev) => ({ ...prev, [day]: open ? [{ start: "09:00", end: "17:00" }] : [] }));
  };

  const saveHours = async () => {
    await fetch("/api/hours", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hours),
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <div className="mx-auto max-w-4xl px-6 py-10 space-y-10">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Owner dashboard</h1>
          <button onClick={logout} className="text-sm rounded-full border border-neutral-300 dark:border-neutral-700 px-4 py-2 hover:border-neutral-400">
            Log out
          </button>
        </header>

        <section>
          <h2 className="font-medium mb-3">Upcoming bookings ({bookings.length})</h2>
          <div className="space-y-2">
            {bookings.length === 0 && <p className="text-sm text-neutral-400">No upcoming bookings.</p>}
            {bookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between rounded-lg border border-neutral-200 dark:border-neutral-800 px-4 py-3 text-sm">
                <div>
                  <p className="font-medium">{b.customerName} <span className="text-neutral-400 font-normal">— {b.customerEmail}</span></p>
                  <p className="text-neutral-500">{b.date} at {minutesToLabel(b.startMinutes)}</p>
                </div>
                <button onClick={() => cancelBooking(b.id)} className="text-red-600 hover:underline">Cancel</button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-medium mb-3">Services</h2>
          <div className="space-y-2 mb-4">
            {services.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg border border-neutral-200 dark:border-neutral-800 px-4 py-2.5 text-sm">
                <span>{s.name} · {s.durationMinutes}min · ${s.price}</span>
                <button onClick={() => removeService(s.id)} className="text-red-600 hover:underline">Remove</button>
              </div>
            ))}
          </div>
          <form onSubmit={addService} className="flex flex-wrap gap-2">
            <input placeholder="Service name" value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm flex-1 min-w-[140px]" />
            <input type="number" min={5} placeholder="Minutes" value={newService.durationMinutes} onChange={(e) => setNewService({ ...newService, durationMinutes: e.target.value })} className="w-24 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm" />
            <input type="number" min={0} placeholder="Price $" value={newService.price} onChange={(e) => setNewService({ ...newService, price: e.target.value })} className="w-24 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm" />
            <button type="submit" className="rounded-lg bg-blue-600 text-white text-sm font-medium px-4 py-2">Add</button>
          </form>
        </section>

        <section>
          <h2 className="font-medium mb-3">Working hours</h2>
          <div className="space-y-2">
            {DAY_NAMES.map((name, day) => {
              const open = (hours[day]?.length ?? 0) > 0;
              const range = hours[day]?.[0];
              return (
                <div key={day} className="flex items-center gap-3 text-sm">
                  <label className="flex items-center gap-2 w-32">
                    <input type="checkbox" checked={open} onChange={(e) => toggleDay(day, e.target.checked)} />
                    {name}
                  </label>
                  {open && range && (
                    <>
                      <input type="time" value={range.start} onChange={(e) => updateDay(day, "start", e.target.value)} className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-2 py-1" />
                      <span className="text-neutral-400">to</span>
                      <input type="time" value={range.end} onChange={(e) => updateDay(day, "end", e.target.value)} className="rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-2 py-1" />
                    </>
                  )}
                </div>
              );
            })}
          </div>
          <button onClick={saveHours} className="mt-4 rounded-lg bg-blue-600 text-white text-sm font-medium px-4 py-2">
            Save hours
          </button>
        </section>
      </div>
    </div>
  );
}
