import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/actions", () => ({
  waitlist: {
    updateWaitlistStatus: vi.fn(),
  },
}));

import { PATCH as patchWaitlistStatus } from "@/app/api/waitlist/[id]/status/route";
import { waitlist } from "@/lib/actions";

const mockedWaitlist = waitlist as unknown as {
  updateWaitlistStatus: ReturnType<typeof vi.fn>;
};

describe("/api/waitlist/[id]/status route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("PATCH should update waitlist status", async () => {
    mockedWaitlist.updateWaitlistStatus.mockResolvedValue({
      success: true,
      data: { id: "w1", status: "ENGAGED" },
    });

    const req = new Request("http://localhost/api/waitlist/w1/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "ENGAGED" }),
    });

    const res = await patchWaitlistStatus(req, { params: Promise.resolve({ id: "w1" }) });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data).toEqual({ id: "w1", status: "ENGAGED" });
    expect(mockedWaitlist.updateWaitlistStatus).toHaveBeenCalledWith({ id: "w1", status: "ENGAGED" });
  });

  it("PATCH should surface validation errors", async () => {
    mockedWaitlist.updateWaitlistStatus.mockResolvedValue({
      success: false,
      error: { code: "INVALID_INPUT", message: "Bad" },
    });

    const req = new Request("http://localhost/api/waitlist/w1/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "" }),
    });

    const res = await patchWaitlistStatus(req, { params: Promise.resolve({ id: "w1" }) });

    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.error.code).toBe("INVALID_INPUT");
  });

  it("PATCH should surface unauthorized errors", async () => {
    mockedWaitlist.updateWaitlistStatus.mockResolvedValue({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Nope" },
    });

    const req = new Request("http://localhost/api/waitlist/w1/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "ENGAGED" }),
    });

    const res = await patchWaitlistStatus(req, { params: Promise.resolve({ id: "w1" }) });

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error.code).toBe("UNAUTHORIZED");
  });
});
