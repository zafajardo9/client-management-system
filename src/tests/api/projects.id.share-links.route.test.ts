import { describe, it, expect, vi, beforeEach } from "vitest";

const getShareLinks = vi.fn(async (projectId: string) => ({ success: true, data: [{ id: "sl1", projectId, slug: "demo" }] }));
const createShareLink = vi.fn(async (projectId: string, body: any) => ({ success: true, data: { id: "sl2", projectId, ...body } }));

vi.mock("@/lib/actions", () => ({
  shareLinks: {
    getShareLinks,
    createShareLink,
  },
}));

import { GET, POST } from "@/app/api/projects/[id]/share-links/route";

describe("/api/projects/:id/share-links route", () => {
  beforeEach(() => vi.clearAllMocks());

  it("GET should list share links", async () => {
    const res = await GET(new Request("http://localhost") as any, { params: { id: "p1" } } as any);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json.data)).toBe(true);
    expect(getShareLinks).toHaveBeenCalledWith("p1");
  });

  it("POST should create share link", async () => {
    const req = new Request("http://localhost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: "public", visibility: "PUBLISHED_ONLY", tagFilter: ["release"] }),
    });
    const res = await POST(req as any, { params: { id: "p1" } } as any);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.data?.projectId).toBe("p1");
    expect(createShareLink).toHaveBeenCalled();
  });
});
