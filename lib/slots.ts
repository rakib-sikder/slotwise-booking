import type { Booking, Service, WorkingHours } from "./types";

const GRANULARITY_MINUTES = 15;
const MIN_NOTICE_MINUTES = 30;

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToLabel(minutes: number): string {
  const h24 = Math.floor(minutes / 60);
  const m = minutes % 60;
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

/** date is a "YYYY-MM-DD" string; parsed as a local calendar date, not a UTC instant. */
function weekdayOf(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d).getDay();
}

export interface SlotOptions {
  date: string;
  service: Service;
  workingHours: WorkingHours;
  bookingsForDate: Booking[];
  now?: Date;
}

/**
 * Computes bookable start times (in minutes-since-midnight) for a given date/service:
 * every `GRANULARITY_MINUTES` slot within working hours where the full service duration
 * fits, doesn't overlap an existing booking, and (for today) is at least
 * `MIN_NOTICE_MINUTES` from now.
 */
export function getAvailableSlots({ date, service, workingHours, bookingsForDate, now = new Date() }: SlotOptions): number[] {
  const ranges = workingHours[weekdayOf(date)] ?? [];
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const isToday = date === todayStr;
  const earliestAllowed = isToday ? now.getHours() * 60 + now.getMinutes() + MIN_NOTICE_MINUTES : -Infinity;

  const slots: number[] = [];

  for (const range of ranges) {
    const rangeStart = timeToMinutes(range.start);
    const rangeEnd = timeToMinutes(range.end);

    for (let start = rangeStart; start + service.durationMinutes <= rangeEnd; start += GRANULARITY_MINUTES) {
      if (start < earliestAllowed) continue;
      const end = start + service.durationMinutes;
      const overlaps = bookingsForDate.some((bk) => start < bk.endMinutes && bk.startMinutes < end);
      if (!overlaps) slots.push(start);
    }
  }

  return slots;
}
