import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/slots";
import { getBookingsForStudioDate } from "@/lib/store";
import type { WorkingHours } from "@/lib/types";

// Studios don't have individually configured hours in this demo — every studio is
// bookable 8am–8pm, every day. Real availability still comes from actual bookings.
const STUDIO_HOURS: WorkingHours = {
  0: [{ start: "08:00", end: "20:00" }],
  1: [{ start: "08:00", end: "20:00" }],
  2: [{ start: "08:00", end: "20:00" }],
  3: [{ start: "08:00", end: "20:00" }],
  4: [{ start: "08:00", end: "20:00" }],
  5: [{ start: "08:00", end: "20:00" }],
  6: [{ start: "08:00", end: "20:00" }],
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const studioId = searchParams.get("studioId");
  const date = searchParams.get("date");
  const durationHours = Number(searchParams.get("durationHours"));

  if (!studioId || !date || !durationHours) {
    return NextResponse.json({ error: "Missing studioId, date, or durationHours" }, { status: 400 });
  }

  const bookingsForDate = await getBookingsForStudioDate(studioId, date);

  const slots = getAvailableSlots({
    date,
    service: { id: "studio-session", name: "Studio session", durationMinutes: durationHours * 60, price: 0 },
    workingHours: STUDIO_HOURS,
    bookingsForDate,
  });

  return NextResponse.json({ slots });
}
