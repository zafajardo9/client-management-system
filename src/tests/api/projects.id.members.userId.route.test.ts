import { describe, it, expect, vi, beforeEach } from "vitest";

import type { ActionResult } from "@/lib/actions";

type RemoveMemberResult = ActionResult<{ projectId: string; userId: string }>;
type UpdateMemberResult = ActionResult<{ projectId: string; userId: string; role: "EDITOR" | "VIEWER" }>;

const removeMember = vi.fn(async (body: { projectId: string; userId: string }): Promise<RemoveMemberResult> => ({
  success: true,
  data: body,
}));

const updateMember = vi.fn(async (body: { projectId: string; userId: string; role: "EDITOR" | "VIEWER" }): Promise<UpdateMemberResult> => ({
  success: true,
  data: body,
}));

vi.mock("@/lib/actions", () => ({
  members: { removeMember, updateMember },
}));

import { DELETE, PATCH } from "@/app/api/projects/[id]/members/[userId]/route";

describe("/api/projects/:id/members/:userId route", () => {
  beforeEach(() => vi.clearAllMocks());

  it("DELETE should remove member", async () => {
    const res = await DELETE(new Request("http://localhost", { method: "DELETE" }), {
      params: Promise.resolve({ id: "p1", userId: "u2" }),
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data?.projectId).toBe("p1");
    expect(json.data?.userId).toBe("u2");
    expect(removeMember).toHaveBeenCalledWith({ projectId: "p1", userId: "u2" });
  });

  it("PATCH should update member role", async () => {
    const req = new Request("http://localhost", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "VIEWER" }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ id: "p1", userId: "u2" }) });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data?.role).toBe("VIEWER");
    expect(updateMember).toHaveBeenCalledWith({ projectId: "p1", userId: "u2", role: "VIEWER" });
  });

  it("PATCH should forward validation errors", async () => {
    updateMember.mockResolvedValueOnce({
      success: false,
      error: { code: "VALIDATION_ERROR", message: "Invalid" },
    });

    const req = new Request("http://localhost", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "" }),
    });
    const res = await PATCH(req, { params: Promise.resolve({ id: "p1", userId: "u2" }) });
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error?.code).toBe("VALIDATION_ERROR");
  });
});
