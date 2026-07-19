"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, PartyPopper, Tag } from "lucide-react";

import type { Studio } from "@/lib/marketplace-data";
import { addOns } from "@/lib/marketplace-data";
import { toDateStr, minutesToLabel } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const STEPS = ["Date & time", "Add-ons", "Your details", "Review & pay"] as const;
const DURATIONS = [1, 2, 3, 4];
const COUPON_CODE = "CREATE10";

const upcomingDays = Array.from({ length: 10 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return { value: toDateStr(d), label: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) };
});

function hashSeed(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h;
}

function getSlotsFor(studioId: string, date: string, duration: number): number[] {
  const seed = hashSeed(`${studioId}-${date}`);
  const slots: number[] = [];
  for (let hour = 8; hour <= 20 - duration; hour++) {
    const taken = (seed >> (hour % 24)) % 5 === 0;
    if (!taken) slots.push(hour * 60);
  }
  return slots;
}

export function BookingFlow({ studio }: { studio: Studio }) {
  const searchParams = useSearchParams();
  const initialDate = searchParams.get("date") ?? upcomingDays[0].value;

  const [step, setStep] = useState(0);
  const [date, setDate] = useState(upcomingDays.some((d) => d.value === initialDate) ? initialDate : upcomingDays[0].value);
  const [duration, setDuration] = useState(2);
  const [slot, setSlot] = useState<number | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<{ id: string } | null>(null);

  const slots = useMemo(() => getSlotsFor(studio.id, date, duration), [studio.id, date, duration]);

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
  };

  const base = studio.pricePerHour * duration;
  const addOnsCost = selectedAddOns.reduce((sum, id) => {
    const a = addOns.find((x) => x.id === id);
    if (!a) return sum;
    return sum + (a.unit === "hr" ? a.price * duration : a.price);
  }, 0);
  const subtotal = base + addOnsCost;
  const discount = couponApplied ? Math.round(subtotal * 0.1 * 100) / 100 : 0;
  const total = Math.max(subtotal - discount, 0);

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === COUPON_CODE) {
      setCouponApplied(true);
      setCouponError(null);
    } else {
      setCouponApplied(false);
      setCouponError("That code isn't valid. Try CREATE10.");
    }
  };

  const canContinue = step === 0 ? slot != null : step === 2 ? form.name.trim() && form.email.trim() : true;

  const confirmBooking = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setConfirmed({ id: `SW-${hashSeed(`${studio.id}-${date}-${slot}-${form.email}`).toString(36).toUpperCase().slice(0, 6)}` });
    setSubmitting(false);
  };

  if (confirmed) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-24 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-violet to-brand-cyan text-white shadow-[0_0_50px_-10px_var(--brand-violet)]"
        >
          <PartyPopper className="size-7" />
        </motion.div>
        <h1 className="mt-6 font-heading text-3xl font-semibold tracking-tight">You&apos;re booked</h1>
        <p className="mt-2 text-muted-foreground" suppressHydrationWarning>
          {studio.name} · {new Date(date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} at{" "}
          {slot != null && minutesToLabel(slot)} · {duration}h
        </p>
        <Card className="mt-6 w-full p-5 text-left">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Confirmation code</span>
            <span className="font-mono font-medium">{confirmed.id}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total paid</span>
            <span className="font-medium">${total.toFixed(2)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Confirmation sent to</span>
            <span className="font-medium">{form.email}</span>
          </div>
        </Card>
        <div className="mt-8 flex gap-3">
          <Button variant="outline" render={<Link href={`/studios/${studio.slug}`} />} className="rounded-full">
            Back to studio
          </Button>
          <Button render={<Link href="/studios" />} className="rounded-full bg-gradient-to-r from-brand-violet to-brand-cyan text-white">
            Book another studio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link href={`/studios/${studio.slug}`} className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="size-4" /> Back to {studio.name}
      </Link>

      {/* Step indicator */}
      <div className="mb-10 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors",
                i < step ? "bg-brand-cyan text-white" : i === step ? "bg-gradient-to-r from-brand-violet to-brand-cyan text-white" : "bg-muted text-muted-foreground"
              )}
            >
              {i < step ? <Check className="size-3.5" /> : i + 1}
            </div>
            <span className={cn("hidden text-xs font-medium sm:block", i === step ? "text-foreground" : "text-muted-foreground")}>{label}</span>
            {i < STEPS.length - 1 && <div className={cn("h-px flex-1", i < step ? "bg-brand-cyan" : "bg-border")} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
            >
              {step === 0 && (
                <Card className="p-6">
                  <h2 className="font-heading text-lg font-medium">When would you like to book?</h2>

                  <p className="mt-5 text-xs font-medium text-muted-foreground">Date</p>
                  <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                    {upcomingDays.map((d) => (
                      <button
                        key={d.value}
                        onClick={() => { setDate(d.value); setSlot(null); }}
                        suppressHydrationWarning
                        className={cn(
                          "shrink-0 rounded-lg border px-3 py-2 text-xs font-medium transition-colors",
                          d.value === date ? "border-transparent bg-gradient-to-r from-brand-violet to-brand-cyan text-white" : "border-border text-muted-foreground hover:border-brand-violet/40"
                        )}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>

                  <p className="mt-5 text-xs font-medium text-muted-foreground">Duration</p>
                  <div className="mt-2 flex gap-2">
                    {DURATIONS.map((h) => (
                      <button
                        key={h}
                        onClick={() => { setDuration(h); setSlot(null); }}
                        className={cn(
                          "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                          h === duration ? "border-transparent bg-gradient-to-r from-brand-violet to-brand-cyan text-white" : "border-border text-muted-foreground hover:border-brand-violet/40"
                        )}
                      >
                        {h}h
                      </button>
                    ))}
                  </div>

                  <p className="mt-5 text-xs font-medium text-muted-foreground">Start time</p>
                  {slots.length === 0 ? (
                    <p className="mt-2 text-sm text-muted-foreground">No availability for this date — try another day or shorter duration.</p>
                  ) : (
                    <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {slots.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSlot(s)}
                          className={cn(
                            "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                            s === slot ? "border-transparent bg-gradient-to-r from-brand-violet to-brand-cyan text-white" : "border-border text-muted-foreground hover:border-brand-violet/40"
                          )}
                        >
                          {minutesToLabel(s)}
                        </button>
                      ))}
                    </div>
                  )}
                </Card>
              )}

              {step === 1 && (
                <Card className="p-6">
                  <h2 className="font-heading text-lg font-medium">Add anything you need</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Optional — skip if the base setup covers you.</p>
                  <div className="mt-5 space-y-2">
                    {addOns.map((addOn) => {
                      const checked = selectedAddOns.includes(addOn.id);
                      return (
                        <button
                          key={addOn.id}
                          onClick={() => toggleAddOn(addOn.id)}
                          className={cn(
                            "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors",
                            checked ? "border-brand-violet/50 bg-brand-violet/10" : "border-border hover:border-brand-violet/30"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn("flex size-5 items-center justify-center rounded-md border", checked ? "border-transparent bg-gradient-to-br from-brand-violet to-brand-cyan" : "border-border")}>
                              {checked && <Check className="size-3.5 text-white" />}
                            </div>
                            <span className="text-sm font-medium">{addOn.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            +${addOn.price}
                            {addOn.unit === "hr" ? "/hr" : ""}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </Card>
              )}

              {step === 2 && (
                <Card className="p-6">
                  <h2 className="font-heading text-lg font-medium">Your details</h2>
                  <div className="mt-5 space-y-4">
                    <div>
                      <Label htmlFor="name">Full name</Label>
                      <Input id="name" className="mt-1.5" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jordan Casey" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" className="mt-1.5" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jordan@email.com" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone (optional)</Label>
                      <Input id="phone" type="tel" className="mt-1.5" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(555) 123-4567" />
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes for the studio (optional)</Label>
                      <Textarea id="notes" className="mt-1.5" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Crew size, special requests…" />
                    </div>
                  </div>
                </Card>
              )}

              {step === 3 && (
                <Card className="overflow-hidden p-0">
                  <div className="relative h-32 w-full">
                    <Image src={studio.images[0]} alt={studio.name} fill sizes="600px" className="object-cover" />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                      <p className="font-heading text-lg font-medium">{studio.name}</p>
                      <p className="text-sm text-white/80">{studio.city}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="font-heading text-lg font-medium">Review &amp; pay</h2>
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground" suppressHydrationWarning>
                          {new Date(date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                          {slot != null ? `, ${minutesToLabel(slot)}` : ""} · {duration}h
                        </span>
                        <span>${base.toFixed(2)}</span>
                      </div>
                      {selectedAddOns.map((id) => {
                        const a = addOns.find((x) => x.id === id)!;
                        const cost = a.unit === "hr" ? a.price * duration : a.price;
                        return (
                          <div key={id} className="flex justify-between text-muted-foreground">
                            <span>{a.name}</span>
                            <span>${cost.toFixed(2)}</span>
                          </div>
                        );
                      })}
                      {couponApplied && (
                        <div className="flex justify-between text-brand-cyan">
                          <span>Coupon ({COUPON_CODE})</span>
                          <span>-${discount.toFixed(2)}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Coupon code" className="pl-9" />
                      </div>
                      <Button variant="outline" onClick={applyCoupon}>Apply</Button>
                    </div>
                    {couponError && <p className="mt-1.5 text-xs text-destructive">{couponError}</p>}
                    {couponApplied && <p className="mt-1.5 text-xs text-brand-cyan">10% off applied.</p>}

                    <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                      <span className="font-heading text-lg font-medium">Total</span>
                      <span className="font-heading text-2xl font-semibold">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex justify-between">
            <Button variant="outline" className="rounded-full" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button
                className="rounded-full bg-gradient-to-r from-brand-violet to-brand-cyan text-white disabled:opacity-50"
                disabled={!canContinue}
                onClick={() => setStep((s) => s + 1)}
              >
                Continue
              </Button>
            ) : (
              <Button
                className="rounded-full bg-gradient-to-r from-brand-violet to-brand-cyan text-white disabled:opacity-50"
                disabled={submitting || !form.name || !form.email}
                onClick={confirmBooking}
              >
                {submitting ? "Confirming…" : `Confirm & pay $${total.toFixed(2)}`}
              </Button>
            )}
          </div>
        </div>

        {/* Sticky summary */}
        <div className="hidden lg:col-span-1 lg:block">
          <Card className="sticky top-24 p-5">
            <p className="font-heading font-medium">{studio.name}</p>
            <p className="text-sm text-muted-foreground">{studio.city}</p>
            <div className="mt-4 space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span suppressHydrationWarning>{new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span>{slot != null ? minutesToLabel(slot) : "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span>{duration}h</span></div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">Estimated total</span>
              <span className="font-heading text-xl font-semibold">${total.toFixed(2)}</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
