import { promises as fs } from "fs";
import os from "os";
import path from "path";
import type { Business, Booking, Service, WorkingHours } from "./types";

// Serverless platforms (Vercel, Lambda) only allow writes under the OS temp dir —
// data here is ephemeral per warm instance. Swap this module for a real database
// (Postgres/SQLite-on-a-volume) before relying on this for real bookings.
const DATA_FILE = path.join(os.tmpdir(), "slotwise-data.json");

const DEFAULT_HOURS: WorkingHours = {
  0: [],
  1: [{ start: "09:00", end: "17:00" }],
  2: [{ start: "09:00", end: "17:00" }],
  3: [{ start: "09:00", end: "17:00" }],
  4: [{ start: "09:00", end: "17:00" }],
  5: [{ start: "09:00", end: "15:00" }],
  6: [],
};

function seed(): Business {
  return {
    name: "Blue Willow Salon",
    services: [
      { id: "cut", name: "Haircut", durationMinutes: 45, price: 55 },
      { id: "color", name: "Color & Style", durationMinutes: 120, price: 140 },
      { id: "consult", name: "Consultation", durationMinutes: 20, price: 0 },
    ],
    workingHours: DEFAULT_HOURS,
    bookings: [],
    bufferMinutes: 0,
    totalRequests: 0,
    cancelledCount: 0,
  };
}

let cache: Business | null = null;

async function load(): Promise<Business> {
  if (cache) return cache;
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    cache = JSON.parse(raw) as Business;
    // Backfill fields added after some deployments already have a persisted file on disk.
    cache.bufferMinutes ??= 0;
    cache.totalRequests ??= cache.bookings.length;
    cache.cancelledCount ??= 0;
  } catch {
    cache = seed();
    await persist();
  }
  return cache;
}

async function persist(): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(cache), "utf-8");
}

export async function getBusiness(): Promise<Business> {
  return load();
}

export async function listServices(): Promise<Service[]> {
  const b = await load();
  return b.services;
}

export async function addService(service: Omit<Service, "id">): Promise<Service> {
  const b = await load();
  const created: Service = { ...service, id: crypto.randomUUID() };
  b.services.push(created);
  await persist();
  return created;
}

export async function deleteService(id: string): Promise<void> {
  const b = await load();
  b.services = b.services.filter((s) => s.id !== id);
  await persist();
}

export async function getWorkingHours(): Promise<WorkingHours> {
  const b = await load();
  return b.workingHours;
}

export async function setWorkingHours(hours: WorkingHours): Promise<void> {
  const b = await load();
  b.workingHours = hours;
  await persist();
}

export async function getBookingsForDate(date: string): Promise<Booking[]> {
  const b = await load();
  return b.bookings.filter((bk) => bk.date === date);
}

export async function listUpcomingBookings(fromDate: string): Promise<Booking[]> {
  const b = await load();
  return b.bookings.filter((bk) => bk.date >= fromDate).sort((a, b2) => a.date.localeCompare(b2.date) || a.startMinutes - b2.startMinutes);
}

export interface CreateBookingInput {
  serviceId: string;
  date: string;
  startMinutes: number;
  endMinutes: number;
  customerName: string;
  customerEmail: string;
}

/** Re-checks for overlap at write time so two near-simultaneous requests can't both win the same slot. */
export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  const b = await load();
  const sameDay = b.bookings.filter((bk) => bk.date === input.date);
  const overlaps = sameDay.some(
    (bk) => input.startMinutes < bk.endMinutes && bk.startMinutes < input.endMinutes
  );
  if (overlaps) {
    throw new Error("That slot was just taken. Please pick another time.");
  }

  const booking: Booking = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  b.bookings.push(booking);
  b.totalRequests += 1;
  await persist();
  return booking;
}

export async function cancelBooking(id: string): Promise<void> {
  const b = await load();
  const existed = b.bookings.some((bk) => bk.id === id);
  b.bookings = b.bookings.filter((bk) => bk.id !== id);
  if (existed) b.cancelledCount += 1;
  await persist();
}

export async function getSettings(): Promise<{ bufferMinutes: number; totalRequests: number; cancelledCount: number }> {
  const b = await load();
  return { bufferMinutes: b.bufferMinutes, totalRequests: b.totalRequests, cancelledCount: b.cancelledCount };
}

export async function setBufferMinutes(bufferMinutes: number): Promise<void> {
  const b = await load();
  b.bufferMinutes = bufferMinutes;
  await persist();
}
