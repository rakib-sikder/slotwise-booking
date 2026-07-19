import { NextRequest, NextResponse } from "next/server";
import { addService, listServices } from "@/lib/store";
import { isAuthed } from "@/lib/require-auth";

export async function GET() {
  return NextResponse.json(await listServices());
}

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as { name?: string; durationMinutes?: number; price?: number };
  if (!body.name || !body.durationMinutes || body.durationMinutes <= 0) {
    return NextResponse.json({ error: "name and durationMinutes are required" }, { status: 400 });
  }

  const service = await addService({
    name: body.name,
    durationMinutes: body.durationMinutes,
    price: body.price ?? 0,
  });
  return NextResponse.json(service, { status: 201 });
}
