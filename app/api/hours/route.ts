import { NextRequest, NextResponse } from "next/server";
import { getWorkingHours, setWorkingHours } from "@/lib/store";
import { isAuthed } from "@/lib/require-auth";
import type { WorkingHours } from "@/lib/types";

export async function GET() {
  return NextResponse.json(await getWorkingHours());
}

export async function PUT(req: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const hours = (await req.json()) as WorkingHours;
  await setWorkingHours(hours);
  return NextResponse.json({ ok: true });
}
