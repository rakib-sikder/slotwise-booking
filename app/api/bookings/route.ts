import { NextRequest, NextResponse } from "next/server";
import { createBooking, getBookingsForDate, getWorkingHours, listServices, listUpcomingBookings } from "@/lib/store";
import { getAvailableSlots } from "@/lib/slots";
import { isAuthed } from "@/lib/require-auth";

export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return NextResponse.json(await listUpcomingBookings(todayStr));
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    serviceId?: string;
    date?: string;
    startMinutes?: number;
    customerName?: string;
    customerEmail?: string;
  };

  if (!body.serviceId || !body.date || body.startMinutes == null || !body.customerName || !body.customerEmail) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const [services, workingHours, bookingsForDate] = await Promise.all([
    listServices(),
    getWorkingHours(),
    getBookingsForDate(body.date),
  ]);

  const service = services.find((s) => s.id === body.serviceId);
  if (!service) return NextResponse.json({ error: "Unknown service" }, { status: 404 });

  // Re-derive the valid slot set server-side — never trust the client's chosen time directly.
  const validSlots = getAvailableSlots({ date: body.date, service, workingHours, bookingsForDate });
  if (!validSlots.includes(body.startMinutes)) {
    return NextResponse.json({ error: "That slot is no longer available. Please pick another." }, { status: 409 });
  }

  try {
    const booking = await createBooking({
      serviceId: service.id,
      date: body.date,
      startMinutes: body.startMinutes,
      endMinutes: body.startMinutes + service.durationMinutes,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
    });
    return NextResponse.json(booking, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not create booking";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
