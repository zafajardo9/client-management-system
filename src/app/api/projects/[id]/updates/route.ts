import { NextResponse } from "next/server";
import { updates } from "@/lib/actions";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = await params;
  const url = new URL(_req.url);
  const status = url.searchParams.get("status") as "DRAFT" | "PUBLISHED" | "ARCHIVED" | null;
  const tags = url.searchParams.getAll("tag"); // allow ?tag=a&tag=b
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "20");

  const result = await updates.getUpdates(projectId, {
    status: status ?? undefined,
    tags: tags.length ? tags : undefined,
    page: Number.isFinite(page) ? page : 1,
    pageSize: Number.isFinite(pageSize) ? pageSize : 20,
  });

  if (result.success) return NextResponse.json({ data: result.data });
  return NextResponse.json({ error: result.error }, { status: 400 });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json();
    const { id } = await params;
    const result = await updates.createUpdate({ ...body, projectId: id });
    if (result.success) return NextResponse.json({ data: result.data }, { status: 201 });
    return NextResponse.json({ error: result.error }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: { code: "BAD_REQUEST", message } }, { status: 400 });
  }
}
