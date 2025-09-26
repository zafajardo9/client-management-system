import { describe, it, expect, vi, beforeEach } from "vitest";

interface RouteParams {
  params: {
    slug: string;
  };
}

const getPublicUpdatesBySlug = vi.fn(async (slug: string) => ({
  success: true,
  data: {
    link: { id: "sl1", projectId: "p1", slug, visibility: "PUBLISHED_ONLY", tagFilter: ["release"] },
    items: [
      { id: "u1", title: "v1", createdAt: new Date(), status: "PUBLISHED", tags: ["release"] },
    ],
  },
}));

vi.mock("@/lib/actions", () => ({
  shareLinks: {
    getPublicUpdatesBySlug,
  },
}));

import { GET } from "@/app/api/share/[slug]/route";

describe("/api/share/:slug route", () => {
  beforeEach(() => vi.clearAllMocks());

  it("GET should return public updates by slug", async () => {
    const res = await GET(new Request("http://localhost"), { params: { slug: "demo" } } as RouteParams);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data?.link?.slug).toBe("demo");
    expect(Array.isArray(json.data?.items)).toBe(true);
    expect(getPublicUpdatesBySlug).toHaveBeenCalledWith("demo");
  });
});
