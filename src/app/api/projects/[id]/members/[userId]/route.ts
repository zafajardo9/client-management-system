import { NextResponse } from "next/server";
import { members } from "@/lib/actions";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string; userId: string }> }) {
  const { id, userId } = await params;
  const result = await members.removeMember({ projectId: id, userId });
  if (result.success) return NextResponse.json({ data: result.data });
  return NextResponse.json({ error: result.error }, { status: 400 });
}
