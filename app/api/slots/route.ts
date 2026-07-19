import { NextRequest, NextResponse } from "next/server";
import { getBookingsForDate, getSettings, getWorkingHours, listServices } from "@/lib/store";
import { getAvailableSlots } from "@/lib/slots";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  const serviceId = req.nextUrl.searchParams.get("serviceId");

  if (!date || !serviceId) {
    return NextResponse.json({ error: "date and serviceId query params are required" }, { status: 400 });
  }

  const [services, workingHours, bookingsForDate, settings] = await Promise.all([
    listServices(),
    getWorkingHours(),
    getBookingsForDate(date),
    getSettings(),
  ]);

  const service = services.find((s) => s.id === serviceId);
  if (!service) return NextResponse.json({ error: "Unknown service" }, { status: 404 });

  const slots = getAvailableSlots({ date, service, workingHours, bookingsForDate, bufferMinutes: settings.bufferMinutes });
  return NextResponse.json({ slots });
}
