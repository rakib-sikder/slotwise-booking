"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { animate } from "animejs";
import { LogOut, Trash2 } from "lucide-react";

import type { Booking, Service, WorkingHours } from "@/lib/types";
import { LogoMark } from "@/components/logo-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

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
  const saveBtnRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const refresh = () => {
    fetch("/api/bookings").then((r) => r.json()).then(setBookings);
    fetch("/api/services").then((r) => r.json()).then(setServices);
    fetch("/api/hours").then((r) => r.json()).then(setHours);
  };

  useEffect(refresh, []);

  useGSAP(
    () => {
      gsap.from("[data-reveal]", { opacity: 0, y: 14, duration: 0.5, stagger: 0.08, ease: "power3.out" });
    },
    { scope: rootRef }
  );

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
    if (saveBtnRef.current) {
      animate(saveBtnRef.current, { scale: [1, 0.92, 1], duration: 250, ease: "outQuad" });
    }
    await fetch("/api/hours", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hours),
    });
  };

  return (
    <div ref={rootRef} className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-10 space-y-10">
        <header data-reveal className="flex items-center justify-between">
          <LogoMark className="text-xl" />
          <Button variant="outline" className="rounded-full" onClick={logout}>
            <LogOut className="size-3.5" />
            Log out
          </Button>
        </header>

        <section data-reveal>
          <h2 className="font-medium mb-3">Upcoming bookings ({bookings.length})</h2>
          <div className="space-y-2">
            {bookings.length === 0 && <p className="text-sm text-muted-foreground">No upcoming bookings.</p>}
            {bookings.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm animate-in fade-in slide-in-from-bottom-1 duration-300"
              >
                <div>
                  <p className="font-medium">
                    {b.customerName} <span className="text-muted-foreground font-normal">— {b.customerEmail}</span>
                  </p>
                  <p className="text-muted-foreground">
                    {b.date} at {minutesToLabel(b.startMinutes)}
                  </p>
                </div>
                <button onClick={() => cancelBooking(b.id)} className="text-destructive hover:underline">
                  Cancel
                </button>
              </div>
            ))}
          </div>
        </section>

        <section data-reveal>
          <h2 className="font-medium mb-3">Services</h2>
          <div className="space-y-2 mb-4">
            {services.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5 text-sm">
                <span>
                  {s.name} · {s.durationMinutes}min · ${s.price}
                </span>
                <button onClick={() => removeService(s.id)} className="text-destructive hover:underline flex items-center gap-1">
                  <Trash2 className="size-3.5" />
                  Remove
                </button>
              </div>
            ))}
          </div>
          <form onSubmit={addService} className="flex flex-wrap gap-2">
            <Input
              placeholder="Service name"
              value={newService.name}
              onChange={(e) => setNewService({ ...newService, name: e.target.value })}
              className="flex-1 min-w-[140px]"
            />
            <Input
              type="number"
              min={5}
              placeholder="Minutes"
              value={newService.durationMinutes}
              onChange={(e) => setNewService({ ...newService, durationMinutes: e.target.value })}
              className="w-24"
            />
            <Input
              type="number"
              min={0}
              placeholder="Price $"
              value={newService.price}
              onChange={(e) => setNewService({ ...newService, price: e.target.value })}
              className="w-24"
            />
            <Button type="submit" className="rounded-lg">
              Add
            </Button>
          </form>
        </section>

        <section data-reveal>
          <h2 className="font-medium mb-3">Working hours</h2>
          <div className="space-y-2">
            {DAY_NAMES.map((name, day) => {
              const open = (hours[day]?.length ?? 0) > 0;
              const range = hours[day]?.[0];
              return (
                <div key={day} className="flex items-center gap-3 text-sm">
                  <label className="flex items-center gap-2 w-32">
                    <Switch checked={open} onCheckedChange={(checked) => toggleDay(day, checked)} />
                    {name}
                  </label>
                  {open && range && (
                    <>
                      <Input
                        type="time"
                        value={range.start}
                        onChange={(e) => updateDay(day, "start", e.target.value)}
                        className="w-auto"
                      />
                      <span className="text-muted-foreground">to</span>
                      <Input
                        type="time"
                        value={range.end}
                        onChange={(e) => updateDay(day, "end", e.target.value)}
                        className="w-auto"
                      />
                    </>
                  )}
                </div>
              );
            })}
          </div>
          <Button ref={saveBtnRef} onClick={saveHours} className="mt-4 rounded-lg">
            Save hours
          </Button>
        </section>
      </div>
    </div>
  );
}
