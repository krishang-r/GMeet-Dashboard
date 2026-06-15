import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/** Returns the current session or redirects to /login. */
export async function requireSession() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session;
}

/** Returns the current session, redirecting to /login if not signed in and
 *  to /dashboard if signed in but not an admin. */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");
  return session;
}

/** All meets visible to a user: assigned directly to them, or to any group
 *  they belong to. De-duplicated and sorted newest first. */
export async function getMeetsForUser(userId: string) {
  const memberships = await prisma.groupMember.findMany({
    where: { userId },
    select: { groupId: true },
  });
  const groupIds = memberships.map((m) => m.groupId);

  const meets = await prisma.meet.findMany({
    where: {
      assignments: {
        some: {
          OR: [
            { userId },
            groupIds.length ? { groupId: { in: groupIds } } : undefined,
          ].filter(Boolean) as object[],
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return meets;
}
