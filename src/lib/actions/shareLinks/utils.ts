import { randomBytes } from "node:crypto";

export function generateShareToken(length = 32): string {
  return randomBytes(Math.max(16, length) / 2).toString("hex");
}
