import { NextResponse } from "next/server";
import { updates } from "@/lib/actions";

export async function GET(_req: Request, { params }: { params: Promise<{ updateId: string }> }) {
  const { updateId } = await params;
  const result = await updates.getUpdateById(updateId);
  if (result.success) return NextResponse.json({ data: result.data });
  return NextResponse.json({ error: result.error }, { status: 400 });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ updateId: string }> }) {
  try {
    const body = await req.json();
    const { updateId } = await params;
    const result = await updates.updateUpdate({ updateId, ...body });
    if (result.success) return NextResponse.json({ data: result.data });
    return NextResponse.json({ error: result.error }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: { code: "BAD_REQUEST", message } }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ updateId: string }> }) {
  const { updateId } = await params;
  const result = await updates.deleteUpdate(updateId);
  if (result.success) return NextResponse.json({ data: result.data });
  return NextResponse.json({ error: result.error }, { status: 400 });
}
