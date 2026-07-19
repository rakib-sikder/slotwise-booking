import { NextRequest, NextResponse } from "next/server";
import { cancelBooking } from "@/lib/store";
import { isAuthed } from "@/lib/require-auth";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await cancelBooking(id);
  return NextResponse.json({ ok: true });
}
