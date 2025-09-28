import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("@/lib/db", () => {
  const waitlistEntry = {
    findUnique: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
    findMany: vi.fn(),
  };
  const waitlistEvent = {
    create: vi.fn(),
  };

  return {
    db: {
      waitlistEntry,
      waitlistEvent,
    },
  };
});

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(async () => ({ userId: "user_123" })),
}));

import { WaitlistStatus, WaitlistEventType } from "@prisma/client";

import { db } from "@/lib/db";
import { createWaitlistEntry, listWaitlistEntries, updateWaitlistStatus } from "@/lib/actions/waitlist";
import { auth } from "@clerk/nextjs/server";

const mockDb = db as unknown as {
  waitlistEntry: {
    findUnique: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    findMany: ReturnType<typeof vi.fn>;
  };
  waitlistEvent: {
    create: ReturnType<typeof vi.fn>;
  };
};

const mockedAuth = auth as unknown as ReturnType<typeof vi.fn>;

describe("waitlist actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedAuth.mockResolvedValue({ userId: "user_123" });
    vi.useRealTimers();
  });

  describe("createWaitlistEntry", () => {
    it("creates a new waitlist entry and logs event", async () => {
      mockDb.waitlistEntry.findUnique.mockResolvedValue(null);
      mockDb.waitlistEntry.create.mockResolvedValue({
        id: "w1",
        status: WaitlistStatus.PENDING,
      });
      mockDb.waitlistEvent.create.mockResolvedValue({ id: "e1" });

      const result = await createWaitlistEntry({ email: "test@example.com" });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ id: "w1", status: WaitlistStatus.PENDING });
      }
      expect(mockDb.waitlistEntry.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ email: "test@example.com" }),
        })
      );
      expect(mockDb.waitlistEvent.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ type: WaitlistEventType.COMMUNICATION }),
        })
      );
    });

    it("updates an existing entry when email already exists", async () => {
      mockDb.waitlistEntry.findUnique.mockResolvedValue({ id: "w1", source: "beta" });
      mockDb.waitlistEntry.update.mockResolvedValue({ id: "w1", status: WaitlistStatus.PENDING });
      mockDb.waitlistEvent.create.mockResolvedValue({ id: "e2" });

      const result = await createWaitlistEntry({
        email: "test@example.com",
        notes: "Revisiting",
      });

      expect(result.success).toBe(true);
      expect(mockDb.waitlistEntry.update).toHaveBeenCalled();
      expect(mockDb.waitlistEvent.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ type: WaitlistEventType.NOTE }),
        })
      );
    });

    it("returns validation error for invalid payload", async () => {
      const result = await createWaitlistEntry({ email: "not-an-email" });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("INVALID_INPUT");
      }
      expect(mockDb.waitlistEntry.create).not.toHaveBeenCalled();
    });
  });

  describe("listWaitlistEntries", () => {
    it("requires authentication", async () => {
      mockedAuth.mockResolvedValueOnce({ userId: null });
      const result = await listWaitlistEntries();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("UNAUTHORIZED");
      }
    });

    it("returns normalized entries with latest event", async () => {
      mockDb.waitlistEntry.findMany.mockResolvedValue([
        {
          id: "w1",
          email: "test@example.com",
          fullName: "Test User",
          company: "Acme",
          goals: null,
          source: "Launch",
          notes: null,
          status: WaitlistStatus.PENDING,
          convertedAt: null,
          createdAt: new Date("2024-01-01T00:00:00.000Z"),
          updatedAt: new Date("2024-01-02T00:00:00.000Z"),
          events: [
            {
              id: "e1",
              type: WaitlistEventType.STATUS_CHANGE,
              notes: null,
              createdAt: new Date("2024-01-03T00:00:00.000Z"),
            },
          ],
        },
      ]);

      const result = await listWaitlistEntries({ status: WaitlistStatus.PENDING });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.entries[0]).toMatchObject({
          id: "w1",
          email: "test@example.com",
          latestEvent: {
            id: "e1",
            type: WaitlistEventType.STATUS_CHANGE,
          },
        });
      }
    });
  });

  describe("updateWaitlistStatus", () => {
    it("returns error when entry is not found", async () => {
      mockDb.waitlistEntry.findUnique.mockResolvedValue(null);

      const result = await updateWaitlistStatus({ id: "missing", status: WaitlistStatus.ENGAGED });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("NOT_FOUND");
      }
    });

    it("updates entry status and logs event", async () => {
      const now = new Date();
      mockDb.waitlistEntry.findUnique.mockResolvedValue({
        id: "w1",
        status: WaitlistStatus.PENDING,
        notes: null,
        convertedAt: null,
      });
      mockDb.waitlistEntry.update.mockResolvedValue({
        id: "w1",
        status: WaitlistStatus.CONVERTED,
      });
      mockDb.waitlistEvent.create.mockResolvedValue({ id: "event" });

      vi.useFakeTimers().setSystemTime(now);

      const result = await updateWaitlistStatus({
        id: "w1",
        status: WaitlistStatus.CONVERTED,
        notes: "Signed contract",
      });

      expect(result.success).toBe(true);
      expect(mockDb.waitlistEntry.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: WaitlistStatus.CONVERTED }),
        })
      );
      expect(mockDb.waitlistEvent.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            payload: expect.objectContaining({ nextStatus: WaitlistStatus.CONVERTED }),
          }),
        })
      );

      vi.useRealTimers();
    });
  });
});
