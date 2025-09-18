import { describe, it, expect, vi, beforeEach } from "vitest";

const addMember = vi.fn(async (body: { projectId: string; userId: string; role: "EDITOR" | "VIEWER" }) => ({
  success: true,
  data: { id: "m1", ...body },
}));
const getMembers = vi.fn(async () => ({ success: true, data: [] as Array<{ userId: string; role: "OWNER" | "EDITOR" | "VIEWER"; user: { id: string; name: string | null; email: string } }> }));

vi.mock("@/lib/actions", () => ({
  members: { addMember, getMembers },
}));

import { GET, POST } from "@/app/api/projects/[id]/members/route";

describe("/api/projects/:id/members route", () => {
  beforeEach(() => vi.clearAllMocks());

  it("GET should list members", async () => {
    const ctx: { params: { id: string } } = { params: { id: "p1" } };
    const res = await GET(new Request("http://localhost/api/projects/p1/members"), ctx);
    expect(res.status).toBe(200);
    expect(getMembers).toHaveBeenCalledWith("p1");
  });

  it("POST should add member", async () => {
    const req = new Request("http://localhost/api/projects/p1/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "u2", role: "EDITOR" }),
    });
    const ctx: { params: { id: string } } = { params: { id: "p1" } };
    const res = await POST(req, ctx);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.data?.projectId).toBe("p1");
    expect(addMember).toHaveBeenCalledWith({ projectId: "p1", userId: "u2", role: "EDITOR" });
  });
});

