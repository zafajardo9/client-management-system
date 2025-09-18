import { describe, it, expect, vi, beforeEach } from "vitest";

const updateShareLink = vi.fn(async (id: string, body: any) => ({ success: true, data: { id, ...body } }));
const deleteShareLink = vi.fn(async (id: string) => ({ success: true, data: { id } }));

vi.mock("@/lib/actions", () => ({
  shareLinks: {
    updateShareLink,
    deleteShareLink,
  },
}));

import { PATCH, DELETE } from "@/app/api/share-links/[id]/route";

describe("/api/share-links/:id route", () => {
  beforeEach(() => vi.clearAllMocks());

  it("PATCH should update share link", async () => {
    const req = new Request("http://localhost", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: false }),
    });
    const res = await PATCH(req as any, { params: { id: "sl1" } } as any);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data?.id).toBe("sl1");
    expect(updateShareLink).toHaveBeenCalled();
  });

  it("DELETE should revoke share link", async () => {
    const res = await DELETE(new Request("http://localhost") as any, { params: { id: "sl1" } } as any);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data?.id).toBe("sl1");
    expect(deleteShareLink).toHaveBeenCalledWith("sl1");
  });
});
