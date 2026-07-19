import { NextRequest, NextResponse } from "next/server";
import { getSettings, setBufferMinutes } from "@/lib/store";
import { isAuthed } from "@/lib/require-auth";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }
  const body = await req.json();
  const bufferMinutes = Number(body.bufferMinutes);
  if (!Number.isFinite(bufferMinutes) || bufferMinutes < 0) {
    return NextResponse.json({ error: "bufferMinutes must be a non-negative number" }, { status: 400 });
  }
  await setBufferMinutes(bufferMinutes);
  return NextResponse.json({ ok: true });
}
