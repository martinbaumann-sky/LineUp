"use server";

import { revalidatePath } from "next/cache";
import { MATCH_STATUS_VALUES, MatchStatus, Role, ensureRole } from "@/types/enums";
import { prisma } from "@/lib/prisma";
import { assertRole, requireMembership } from "@/lib/actions/guards";
import { matchSchema, availabilitySchema } from "@/lib/validators/match";
import { sendNotification } from "@/lib/actions/notification";

export async function createMatch(teamId: string, formData: FormData) {
  const { membership } = await requireMembership(teamId);
  const role = ensureRole(membership.role);
  assertRole(role, [Role.OWNER, Role.ADMIN, Role.COACH]);
  const data = Object.fromEntries(formData.entries());
  const parsed = matchSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Datos inválidos" };
  }
  const match = await prisma.match.create({
    data: {
      teamId,
      opponent: parsed.data.opponent,
      location: parsed.data.location,
      kickoffAt: parsed.data.kickoffAt,
      competition: parsed.data.competition,
      notes: parsed.data.notes,
      chatRoom: {
        create: {
          teamId,
          type: "MATCH"
        }
      }
    }
  });

  const members = await prisma.membership.findMany({ where: { teamId }, select: { userId: true } });
  await Promise.all(
    members.map((member) =>
      sendNotification(member.userId, "MATCH_CREATED", {
        matchId: match.id,
        opponent: match.opponent,
        kickoffAt: match.kickoffAt
      })
    )
  );

  revalidatePath("/dashboard/fixture");
  return { success: true };
}

export async function updateMatchStatus(matchId: string, status: MatchStatus) {
  if (!MATCH_STATUS_VALUES.includes(status)) {
    throw new Error("Estado de partido inválido");
  }
  const match = await prisma.match.findUnique({ where: { id: matchId } });
  if (!match) {
    throw new Error("Partido no encontrado");
  }
  const { membership } = await requireMembership(match.teamId);
  const role = ensureRole(membership.role);
  assertRole(role, [Role.OWNER, Role.ADMIN, Role.COACH]);
  await prisma.match.update({ where: { id: matchId }, data: { status } });
  revalidatePath("/dashboard/fixture");
}

export async function deleteMatch(matchId: string) {
  const match = await prisma.match.findUnique({ where: { id: matchId } });
  if (!match) {
    throw new Error("Partido no encontrado");
  }
  const { membership } = await requireMembership(match.teamId);
  const role = ensureRole(membership.role);
  assertRole(role, [Role.OWNER, Role.ADMIN]);
  await prisma.match.delete({ where: { id: matchId } });
  revalidatePath("/dashboard/fixture");
}

export async function setAvailability(matchId: string, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const parsed = availabilitySchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Estado inválido" };
  }
  const match = await prisma.match.findUnique({ where: { id: matchId } });
  if (!match) throw new Error("Partido no encontrado");
  const { membership, session } = await requireMembership(match.teamId);
  await prisma.availability.upsert({
    where: { matchId_userId: { matchId, userId: session.user.id } },
    create: {
      matchId,
      userId: session.user.id,
      status: parsed.data.status
    },
    update: { status: parsed.data.status }
  });
  revalidatePath("/dashboard/fixture");
  revalidatePath("/dashboard/inicio");
  return { success: true };
}
