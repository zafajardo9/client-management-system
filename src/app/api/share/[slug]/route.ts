import { NextResponse } from "next/server";
import { shareLinks } from "@/lib/actions";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await shareLinks.getPublicUpdatesBySlug(slug);
  if (result.success) return NextResponse.json({ data: result.data });
  return NextResponse.json({ error: result.error }, { status: 404 });
}
