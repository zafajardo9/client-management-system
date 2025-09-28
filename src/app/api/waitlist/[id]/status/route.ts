import { NextResponse } from "next/server";

import { waitlist } from "@/lib/actions";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const body = await req.json();
    const result = await waitlist.updateWaitlistStatus({ id, ...body });

    if (result.success) {
      return NextResponse.json({ data: result.data });
    }

    const statusCode = result.error.code === "INVALID_INPUT" ? 422 : result.error.code === "UNAUTHORIZED" ? 401 : 400;
    return NextResponse.json({ error: result.error }, { status: statusCode });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ error: { code: "BAD_REQUEST", message } }, { status: 400 });
  }
}
