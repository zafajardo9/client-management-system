import { NextResponse } from "next/server";
import { shareLinks } from "@/lib/actions";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const result = await shareLinks.updateShareLink(params.id, body);
    if (result.success) return NextResponse.json({ data: result.data });
    return NextResponse.json({ error: result.error }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: { code: "BAD_REQUEST", message } }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const result = await shareLinks.deleteShareLink(params.id);
  if (result.success) return NextResponse.json({ data: result.data });
  return NextResponse.json({ error: result.error }, { status: 400 });
}
