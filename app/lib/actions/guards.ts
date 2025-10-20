import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/session";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("No autorizado");
  }
  return session;
}

export async function requireMembership(teamId: string) {
  const session = await requireAuth();
  const membership = await prisma.membership.findFirst({
    where: { teamId, userId: session.user.id }
  });
  if (!membership) {
    throw new Error("No perteneces a este equipo");
  }
  return { session, membership };
}

export function assertRole(role: Role, allowed: Role[]) {
  if (!allowed.includes(role)) {
    throw new Error("Permisos insuficientes");
  }
}