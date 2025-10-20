"use server";

import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { assertRole, requireMembership } from "@/lib/actions/guards";
import { boardRoleSchema } from "@/lib/validators/team";

export async function upsertBoardRole(teamId: string, formData: FormData) {
  const { membership } = await requireMembership(teamId);
  assertRole(membership.role, [Role.OWNER, Role.ADMIN]);
  const payload = Object.fromEntries(formData.entries());
  const parsed = boardRoleSchema.safeParse(payload);
  if (!parsed.success) {
    return { error: "Datos inválidos" };
  }
  await prisma.boardRole.upsert({
    where: {
      teamId_title: {
        teamId,
        title: parsed.data.title
      }
    },
    update: {
      membershipId: parsed.data.membershipId
    },
    create: {
      teamId,
      membershipId: parsed.data.membershipId,
      title: parsed.data.title
    }
  });
  revalidatePath("/dashboard/directiva");
  return { success: true };
}

export async function removeBoardRole(teamId: string, title: string) {
  const { membership } = await requireMembership(teamId);
  assertRole(membership.role, [Role.OWNER, Role.ADMIN]);
  await prisma.boardRole.delete({ where: { teamId_title: { teamId, title } } });
  revalidatePath("/dashboard/directiva");
}