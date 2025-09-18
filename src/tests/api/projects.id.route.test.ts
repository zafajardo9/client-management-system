import { describe, it, expect, vi, beforeEach } from "vitest";

const getProjectById = vi.fn(async (id: string) => ({
  success: true,
  data: { id, name: "Demo", description: null, isArchived: false },
}));
const updateProject = vi.fn(async (body: Record<string, unknown>) => ({ success: true, data: { ...body } }));
const archiveProject = vi.fn(async (id: string) => ({ success: true, data: { id, isArchived: true } }));

vi.mock("@/lib/actions", () => ({
  projects: {
    getProjectById,
    updateProject,
    archiveProject,
  },
}));

import { GET, PATCH, DELETE } from "@/app/api/projects/[id]/route";

describe("/api/projects/:id route", () => {
  beforeEach(() => vi.clearAllMocks());

  it("GET should return project details", async () => {
    const ctx: { params: { id: string } } = { params: { id: "p1" } };
    const res = await GET(new Request("http://localhost"), ctx);
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
    const ctx: { params: { id: string } } = { params: { id: "p1" } };
    const res = await PATCH(req, ctx);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data?.id).toBe("p1");
    expect(json.data?.name).toBe("Updated");
    expect(updateProject).toHaveBeenCalled();
  });

  it("DELETE should archive project", async () => {
    const ctx: { params: { id: string } } = { params: { id: "p1" } };
    const res = await DELETE(new Request("http://localhost", { method: "DELETE" }), ctx);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data?.id).toBe("p1");
    expect(json.data?.isArchived).toBe(true);
    expect(archiveProject).toHaveBeenCalledWith("p1");
  });
});

