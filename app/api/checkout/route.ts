import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

interface CheckoutBody {
  studioId: string;
  studioSlug: string;
  studioName: string;
  date: string;
  startMinutes: number;
  durationHours: number;
  addOnLabel?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  notes?: string;
  total: number;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<CheckoutBody>;

  if (
    !body.studioId ||
    !body.studioSlug ||
    !body.studioName ||
    !body.date ||
    body.startMinutes == null ||
    !body.durationHours ||
    !body.customerName ||
    !body.customerEmail ||
    !body.total
  ) {
    return NextResponse.json({ error: "Missing required booking fields" }, { status: 400 });
  }

  const origin = req.headers.get("origin") || new URL(req.url).origin;
  const label = `${body.studioName} · ${body.durationHours}h session`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: body.customerEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(body.total * 100),
            product_data: {
              name: label,
              description: body.addOnLabel || undefined,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        studioId: body.studioId,
        studioSlug: body.studioSlug,
        studioName: body.studioName,
        date: body.date,
        startMinutes: String(body.startMinutes),
        durationHours: String(body.durationHours),
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone || "",
        notes: body.notes || "",
        total: String(body.total),
      },
      success_url: `${origin}/studios/${body.studioSlug}/book?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/studios/${body.studioSlug}/book?cancelled=1`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not start checkout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
