import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

type ClaimsWithMetadata = {
  metadata?: { role?: unknown };
  publicMetadata?: { role?: unknown };
};

export async function getAdminContext() {
  const { userId, sessionClaims } = await auth();
  const claims = sessionClaims as ClaimsWithMetadata | null;
  const rawRole = claims?.metadata?.role ?? claims?.publicMetadata?.role ?? "";
  const role = String(rawRole).toLowerCase();
  const adminUserIds = (process.env.ADMIN_USER_IDS || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  return {
    userId,
    role,
    isAdmin: Boolean(
      userId &&
        (role === "admin" || adminUserIds.includes(userId))
    ),
  };
}

export async function requireAdmin() {
  const context = await getAdminContext();

  if (!context.isAdmin) {
    return {
      authorized: false as const,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 403 }),
    };
  }

  return {
    authorized: true as const,
    userId: context.userId!,
    role: context.role,
  };
}
