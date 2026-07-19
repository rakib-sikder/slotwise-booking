import { NextRequest, NextResponse } from "next/server";
import { createContactMessage, listContactMessages } from "@/lib/store";
import { isAuthed } from "@/lib/require-auth";

export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await listContactMessages(10));
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { name?: string; email?: string; topic?: string; message?: string };

  if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) {
    return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
  }

  const created = await createContactMessage({
    name: body.name.trim(),
    email: body.email.trim(),
    topic: body.topic?.trim() || "other",
    message: body.message.trim(),
  });

  return NextResponse.json(created, { status: 201 });
}
