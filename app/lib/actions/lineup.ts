"use server";

import { revalidatePath } from "next/cache";
import { Role, ensureRole } from "@/types/enums";
import { prisma } from "@/lib/prisma";
import { assertRole, requireMembership } from "@/lib/actions/guards";
import { lineupSchema } from "@/lib/validators/lineup";
import { sendNotification } from "@/lib/actions/notification";

export async function saveLineup(matchId: string, payload: unknown) {
  const match = await prisma.match.findUnique({ where: { id: matchId } });
  if (!match) throw new Error("Partido no encontrado");
  const { membership } = await requireMembership(match.teamId);
  const role = ensureRole(membership.role);
  assertRole(role, [Role.OWNER, Role.ADMIN, Role.COACH]);

  const parsed = lineupSchema.safeParse(payload);
  if (!parsed.success) {
    return { error: "Datos inválidos" };
  }

  await prisma.lineup.upsert({
    where: { matchId },
    create: {
      matchId,
      formation: parsed.data.formation,
      notes: parsed.data.notes,
      slots: {
        create: parsed.data.slots.map((slot) => ({
          membershipId: slot.membershipId,
          positionLabel: slot.positionLabel,
          x: slot.x,
          y: slot.y
        }))
      },
      published: true
    },
    update: {
      formation: parsed.data.formation,
      notes: parsed.data.notes,
      published: true,
      slots: {
        deleteMany: {},
        create: parsed.data.slots.map((slot) => ({
          membershipId: slot.membershipId,
          positionLabel: slot.positionLabel,
          x: slot.x,
          y: slot.y
        }))
      }
    }
  });

  const members = await prisma.membership.findMany({ where: { teamId: match.teamId }, select: { userId: true } });
  await Promise.all(
    members.map((member) =>
      sendNotification(member.userId, "LINEUP_PUBLISHED", {
        matchId,
        opponent: match.opponent,
        kickoffAt: match.kickoffAt
      })
    )
  );

  revalidatePath("/dashboard/alineacion");
  return { success: true };
}
