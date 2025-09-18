import { describe, it, expect, vi, beforeEach } from "vitest";

const getUpdateById = vi.fn(async (id: string) => ({ success: true, data: { id, title: "u", createdAt: new Date(), status: "PUBLISHED", tags: [] } }));
const updateUpdate = vi.fn(async (body: any) => ({ success: true, data: { id: body.updateId } }));
const deleteUpdate = vi.fn(async (id: string) => ({ success: true, data: { id } }));

vi.mock("@/lib/actions", () => ({
  updates: {
    getUpdateById,
    updateUpdate,
    deleteUpdate,
  },
}));

import { GET, PATCH, DELETE } from "@/app/api/updates/[updateId]/route";

describe("/api/updates/:updateId route", () => {
  beforeEach(() => vi.clearAllMocks());

  it("GET should return update", async () => {
    const res = await GET(new Request("http://localhost"), { params: { updateId: "u1" } } as any);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data?.id).toBe("u1");
  });

  it("PATCH should update update", async () => {
    const req = new Request("http://localhost", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New" }),
    });
    const res = await PATCH(req as any, { params: { updateId: "u1" } } as any);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data?.id).toBe("u1");
    expect(updateUpdate).toHaveBeenCalled();
  });

  it("DELETE should delete update", async () => {
    const res = await DELETE(new Request("http://localhost") as any, { params: { updateId: "u1" } } as any);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data?.id).toBe("u1");
    expect(deleteUpdate).toHaveBeenCalledWith("u1");
  });
});
