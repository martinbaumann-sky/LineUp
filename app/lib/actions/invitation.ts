"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/session";

export async function acceptInvitation(token: string) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/sign-in?callbackUrl=/join/${token}`);
  }
  const invitation = await prisma.invitation.findUnique({ where: { token } });
  if (!invitation) {
    throw new Error("Invitación inválida");
  }
  if (invitation.expiresAt < new Date()) {
    throw new Error("Invitación vencida");
  }
  await prisma.membership.upsert({
    where: {
      userId_teamId: {
        userId: session.user.id,
        teamId: invitation.teamId
      }
    },
    create: {
      userId: session.user.id,
      teamId: invitation.teamId,
      role: invitation.roleDefault
    },
    update: {
      role: invitation.roleDefault
    }
  });
  await prisma.invitation.update({
    where: { id: invitation.id },
    data: { acceptedAt: new Date() }
  });
  redirect("/dashboard/inicio");
}