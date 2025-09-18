import { describe, it, expect, vi, beforeEach } from "vitest";

interface ProjectData {
  name?: string;
  description?: string;
  isArchived?: boolean;
}

vi.mock("@/lib/actions", () => ({
  projects: {
    getProjects: vi.fn(async () => ({ success: true, data: [{ id: "p1", name: "Demo", description: null, isArchived: false }] })),
    createProject: vi.fn(async (body: ProjectData) => ({ success: true, data: { id: "p2", ...body } })),
  },
}));

import { GET as getProjects, POST as postProject } from "@/app/api/projects/route";

describe("/api/projects route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET should list projects", async () => {
    const res = await getProjects();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data).toBeTruthy();
    expect(Array.isArray(json.data)).toBe(true);
  });

  it("POST should create a project", async () => {
    const req = new Request("http://localhost/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "New Project", description: "Test" }),
    });
    const res = await postProject(req);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.data?.id).toBeDefined();
    expect(json.data?.name).toBe("New Project");
  });
});
