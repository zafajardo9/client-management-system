import { describe, it, expect, vi, beforeEach } from "vitest";

const getProjectById = vi.fn(async (id: string) => ({
  success: true,
  data: { id, name: "Demo", description: null, isArchived: false },
}));
const updateProject = vi.fn(async (body: any) => ({ success: true, data: { ...body } }));

vi.mock("@/lib/actions", () => ({
  projects: {
    getProjectById,
    updateProject,
  },
}));

import { GET, PATCH } from "@/app/api/projects/[id]/route";

describe("/api/projects/:id route", () => {
  beforeEach(() => vi.clearAllMocks());

  it("GET should return project details", async () => {
    const res = await GET(new Request("http://localhost"), { params: { id: "p1" } } as any);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data?.id).toBe("p1");
  });

  it("PATCH should update project", async () => {
    const req = new Request("http://localhost", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Updated" }),
    });
    const res = await PATCH(req, { params: { id: "p1" } } as any);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data?.id).toBe("p1");
    expect(json.data?.name).toBe("Updated");
    expect(updateProject).toHaveBeenCalled();
  });
});
