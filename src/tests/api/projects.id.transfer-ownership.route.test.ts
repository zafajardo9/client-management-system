import { describe, it, expect, vi, beforeEach } from "vitest";

import type { ActionResult } from "@/lib/actions";

type TransferOwnershipResult = ActionResult<{ projectId: string; ownerId: string }>;

const transferOwnership = vi.fn(async (_payload: { projectId: string; targetUserId: string }): Promise<TransferOwnershipResult> => ({
  success: true,
  data: { projectId: "proj_1", ownerId: "user_2" },
}));

vi.mock("@/lib/actions", () => ({
  projects: {
    transferOwnership,
  },
}));

import { POST } from "@/app/api/projects/[id]/transfer-ownership/route";

describe("/api/projects/:id/transfer-ownership route", () => {
  beforeEach(() => vi.clearAllMocks());

  it("transfers ownership when payload is valid", async () => {
    const req = new Request("http://localhost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUserId: "user_2" }),
    });
    const res = await POST(req, { params: Promise.resolve({ id: "proj_1" }) });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data?.ownerId).toBe("user_2");
    expect(transferOwnership).toHaveBeenCalledWith({ projectId: "proj_1", targetUserId: "user_2" });
  });

  it("returns validation error from action", async () => {
    transferOwnership.mockResolvedValueOnce({
      success: false,
      error: { code: "VALIDATION_ERROR", message: "Invalid" },
    });

    const req = new Request("http://localhost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUserId: "" }),
    });
    const res = await POST(req, { params: Promise.resolve({ id: "proj_1" }) });

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error?.code).toBe("VALIDATION_ERROR");
  });
});
