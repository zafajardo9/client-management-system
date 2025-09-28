import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/actions", () => ({
  waitlist: {
    listWaitlistEntries: vi.fn(),
    createWaitlistEntry: vi.fn(),
    updateWaitlistStatus: vi.fn(),
  },
}));

import { GET as getWaitlist, POST as postWaitlist } from "@/app/api/waitlist/route";
import { waitlist } from "@/lib/actions";

const mockedWaitlist = waitlist as unknown as {
  listWaitlistEntries: ReturnType<typeof vi.fn>;
  createWaitlistEntry: ReturnType<typeof vi.fn>;
};

describe("/api/waitlist route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET should return waitlist entries", async () => {
    mockedWaitlist.listWaitlistEntries.mockResolvedValue({
      success: true,
      data: { entries: [{ id: "w1" }] },
    });

    const req = new Request("http://localhost/api/waitlist?status=PENDING&limit=10");
    const res = await getWaitlist(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data).toEqual([{ id: "w1" }]);
    expect(mockedWaitlist.listWaitlistEntries).toHaveBeenCalledWith({ status: "PENDING", search: undefined, limit: 10 });
  });

  it("GET should surface error status codes", async () => {
    mockedWaitlist.listWaitlistEntries.mockResolvedValue({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Nope" },
    });

    const req = new Request("http://localhost/api/waitlist");
    const res = await getWaitlist(req);

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error.code).toBe("UNAUTHORIZED");
  });

  it("POST should create waitlist entry", async () => {
    mockedWaitlist.createWaitlistEntry.mockResolvedValue({
      success: true,
      data: { id: "w2", status: "PENDING" },
    });

    const req = new Request("http://localhost/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com" }),
    });

    const res = await postWaitlist(req);

    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.data).toEqual({ id: "w2", status: "PENDING" });
    expect(mockedWaitlist.createWaitlistEntry).toHaveBeenCalledWith({ email: "test@example.com" });
  });

  it("POST should surface validation errors", async () => {
    mockedWaitlist.createWaitlistEntry.mockResolvedValue({
      success: false,
      error: { code: "INVALID_INPUT", message: "Invalid" },
    });

    const req = new Request("http://localhost/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "not-an-email" }),
    });

    const res = await postWaitlist(req);

    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.error.code).toBe("INVALID_INPUT");
  });
});
