import { NextResponse } from "next/server";

import { waitlist } from "@/lib/actions";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status") ?? undefined;
  const search = url.searchParams.get("search") ?? undefined;
  const limitParam = url.searchParams.get("limit");
  const limit = limitParam ? Number(limitParam) : undefined;

  const result = await waitlist.listWaitlistEntries({ status, search, limit });

  if (result.success) {
    return NextResponse.json({ data: result.data.entries });
  }

  const statusCode = result.error.code === "UNAUTHORIZED" ? 401 : 400;
  return NextResponse.json({ error: result.error }, { status: statusCode });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await waitlist.createWaitlistEntry(body);

    if (result.success) {
      return NextResponse.json({ data: result.data }, { status: 201 });
    }

    const statusCode = result.error.code === "INVALID_INPUT" ? 422 : 400;
    return NextResponse.json({ error: result.error }, { status: statusCode });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ error: { code: "BAD_REQUEST", message } }, { status: 400 });
  }
}
