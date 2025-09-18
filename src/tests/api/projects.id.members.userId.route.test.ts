import { describe, it, expect, vi, beforeEach } from "vitest";

const removeMember = vi.fn(async (body: { projectId: string; userId: string }) => ({
  success: true,
  data: body,
}));

vi.mock("@/lib/actions", () => ({
  members: { removeMember },
}));

import { DELETE } from "@/app/api/projects/[id]/members/[userId]/route";

describe("/api/projects/:id/members/:userId route", () => {
  beforeEach(() => vi.clearAllMocks());

  it("DELETE should remove member", async () => {
    const ctx: { params: { id: string; userId: string } } = { params: { id: "p1", userId: "u2" } };
    const res = await DELETE(new Request("http://localhost", { method: "DELETE" }), ctx);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data?.projectId).toBe("p1");
    expect(json.data?.userId).toBe("u2");
    expect(removeMember).toHaveBeenCalledWith({ projectId: "p1", userId: "u2" });
  });
});
