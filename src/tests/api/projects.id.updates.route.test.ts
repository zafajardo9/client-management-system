import { describe, it, expect, vi, beforeEach } from "vitest";

const getUpdates = vi.fn(async () => ({ success: true, data: { items: [], page: 1, pageSize: 20, total: 0 } }));
const createUpdate = vi.fn(async (body: any) => ({ success: true, data: { id: "u1", ...body } }));

vi.mock("@/lib/actions", () => ({
  updates: {
    getUpdates,
    createUpdate,
  },
}));

import { GET, POST } from "@/app/api/projects/[id]/updates/route";

describe("/api/projects/:id/updates route", () => {
  beforeEach(() => vi.clearAllMocks());

  it("GET should list updates with filters", async () => {
    const req = new Request("http://localhost/api/projects/p1/updates?status=PUBLISHED&tag=a&tag=b&page=2&pageSize=5");
    const res = await GET(req as any, { params: { id: "p1" } } as any);
    expect(res.status).toBe(200);
    expect(getUpdates).toHaveBeenCalledWith("p1", expect.objectContaining({ status: "PUBLISHED" }));
  });

  it("POST should create update", async () => {
    const req = new Request("http://localhost/api/projects/p1/updates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "v1", bodyMd: "Init", tags: ["release"], status: "PUBLISHED" }),
    });
    const res = await POST(req as any, { params: { id: "p1" } } as any);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.data?.projectId).toBe("p1");
  });
});
