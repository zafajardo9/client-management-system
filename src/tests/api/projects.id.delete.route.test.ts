import { describe, it, expect, vi, beforeEach } from "vitest";

import type { ActionResult } from "@/lib/actions";

const deleteProject = vi.fn(async (id: string): Promise<ActionResult<{ id: string }>> => ({
  success: true,
  data: { id },
}));

vi.mock("@/lib/actions/projects", () => ({
  deleteProject,
}));

import { POST } from "@/app/api/projects/[id]/delete/route";

describe("/api/projects/:id/delete route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("removes project when action succeeds", async () => {
    const res = await POST(new Request("http://localhost", { method: "POST" }), {
      params: Promise.resolve({ id: "proj_1" }),
    });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data?.id).toBe("proj_1");
    expect(deleteProject).toHaveBeenCalledWith("proj_1");
  });

  it("returns error when action fails", async () => {
    deleteProject.mockResolvedValueOnce({
      success: false,
      error: { code: "NOT_FOUND", message: "Project not found." },
    });

    const res = await POST(new Request("http://localhost", { method: "POST" }), {
      params: Promise.resolve({ id: "proj_missing" }),
    });

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error?.code).toBe("NOT_FOUND");
  });
});
