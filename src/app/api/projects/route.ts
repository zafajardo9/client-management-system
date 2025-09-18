import { NextResponse } from "next/server";
import { projects } from "@/lib/actions";

export async function GET() {
  const result = await projects.getProjects();
  if (result.success) return NextResponse.json({ data: result.data });
  return NextResponse.json({ error: result.error }, { status: 400 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await projects.createProject(body);
    if (result.success) return NextResponse.json({ data: result.data }, { status: 201 });
    return NextResponse.json({ error: result.error }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: { code: "BAD_REQUEST", message } }, { status: 400 });
  }
}
