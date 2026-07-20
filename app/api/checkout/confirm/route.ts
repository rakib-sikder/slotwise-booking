import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createBooking } from "@/lib/store";

export async function POST(req: NextRequest) {
  const { sessionId } = (await req.json()) as { sessionId?: string };
  if (!sessionId) return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return NextResponse.json({ error: "Payment not completed" }, { status: 402 });
  }

  const m = session.metadata;
  if (!m?.studioId || !m.date || !m.startMinutes || !m.durationHours) {
    return NextResponse.json({ error: "Checkout session is missing booking details" }, { status: 400 });
  }

  const startMinutes = Number(m.startMinutes);
  const endMinutes = startMinutes + Number(m.durationHours) * 60;

  try {
    const booking = await createBooking({
      studioId: m.studioId,
      studioName: m.studioName,
      label: `${m.studioName} · ${m.durationHours}h session`,
      price: Number(m.total),
      date: m.date,
      startMinutes,
      endMinutes,
      customerName: m.customerName,
      customerEmail: m.customerEmail,
      stripeSessionId: session.id,
    });
    return NextResponse.json(booking, { status: 201 });
  } catch (err) {
    // Slot was taken between payment and confirmation — the charge already succeeded, so
    // don't silently drop it. Surface it clearly; a real system would auto-refund here.
    const message = err instanceof Error ? err.message : "Could not finalize booking";
    return NextResponse.json({ error: message, paid: true }, { status: 409 });
  }
}
