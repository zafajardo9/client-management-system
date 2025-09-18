import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "../db";

export async function ensureUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const existing = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (existing) return existing;

  const cu = await currentUser();
  if (!cu) return null;

  const email = cu.primaryEmailAddress?.emailAddress ?? (cu.emailAddresses[0]?.emailAddress ?? "");
  const name = cu.fullName ?? cu.username ?? email;
  const imageUrl = cu.imageUrl ?? undefined;

  return db.user.upsert({
    where: { clerkUserId: userId },
    update: { email, name, imageUrl },
    create: { clerkUserId: userId, email, name, imageUrl },
  });
}
