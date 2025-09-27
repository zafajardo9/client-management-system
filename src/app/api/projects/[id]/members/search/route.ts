import { NextResponse } from "next/server";

import { members } from "@/lib/actions";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const url = new URL(req.url);
  const query = url.searchParams.get("q") ?? "";
  const limitParam = url.searchParams.get("limit");
  const limit = Number.isFinite(limitParam ? Number(limitParam) : NaN) ? Number(limitParam) : undefined;

  const result = await members.searchCollaboratorCandidates({ projectId: id, query, limit });

  if (result.success) {
    return NextResponse.json({ data: result.data });
  }

  return NextResponse.json({ error: result.error }, { status: 400 });
}
