import { NextResponse } from "next/server";
import { shareLinks } from "@/lib/actions";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const result = await shareLinks.getPublicUpdatesBySlug(params.slug);
  if (result.success) return NextResponse.json({ data: result.data });
  return NextResponse.json({ error: result.error }, { status: 404 });
}
